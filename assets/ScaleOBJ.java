/*

*/
import java.util.Scanner;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintStream;

public class ScaleOBJ
{
   public static void main(String[] args)
   {
      // Check for a file name on the command line.
      if ( 0 == args.length || 2 < args.length )
      {
         System.err.println("Usage: java ScaleOBJ <OBJ-file-name> [<scale-factor>]");
         System.exit(-1);
      }

      // Open the file named on the command line.
      FileInputStream fis = null;
      try
      {
         fis = new FileInputStream(args[0]);
      }
      catch (FileNotFoundException e)
      {
         e.printStackTrace(System.err);
         System.err.printf("ERROR! Could not open OBJ file: %s\n", args[0]);
         System.exit(-1);
      }

      double scaleFactor = 1.0;
      if ( 2 == args.length )
      try
      {
         scaleFactor = Double.parseDouble( args[1] );
      }
      catch (NumberFormatException e)
      {
         e.printStackTrace(System.err);
         System.err.println("Usage: java ScaleOBJ <OBJ-file-name> [<scale-factor>]");
         System.exit(-1);
      }

      double maxX = Double.NEGATIVE_INFINITY;
      double maxY = Double.NEGATIVE_INFINITY;
      double maxZ = Double.NEGATIVE_INFINITY;
      double minX = Double.POSITIVE_INFINITY;
      double minY = Double.POSITIVE_INFINITY;
      double minZ = Double.POSITIVE_INFINITY;
      try
      {
         Scanner scanner = new Scanner(fis);
         while ( scanner.hasNext() )
         {
            String token = scanner.next();
            if ( token.startsWith("#")
              || token.startsWith("vt")
              || token.startsWith("vn")
              || token.startsWith("f")
              || token.startsWith("s")
              || token.startsWith("g")
              || token.startsWith("o")
              || token.startsWith("usemtl")
              || token.startsWith("mtllib") )
            {
               scanner.nextLine(); // skip over these lines
            }
            else if ( token.startsWith("v") )
            {
               double x = scanner.nextDouble();
               double y = scanner.nextDouble();
               double z = scanner.nextDouble();
               if ( x > maxX ) maxX = x;
               if ( y > maxY ) maxY = y;
               if ( z > maxZ ) maxZ = z;
               if ( x < minX ) minX = x;
               if ( y < minY ) minY = y;
               if ( z < minZ ) minZ = z;
               //System.err.printf("v % .4f  % .4f  % .4f\n", x, y, z);
            }
            else
            {
               String temp = scanner.nextLine();  // skip over unknown lines
               System.err.println(token + temp);  // and log them
            }
         }
         fis.close();
      }
      catch (IOException e)
      {
         System.err.printf("ERROR! Could not read OBJ file: %s\n", args[0]);
         e.printStackTrace(System.err);
         System.exit(-1);
      }

      System.err.printf("max % .4f  % .4f  % .4f\n", maxX, maxY, maxZ);
      System.err.printf("min % .4f  % .4f  % .4f\n", minX, minY, minZ);


      if ( 2 == args.length )
      {
         // Build a name for the output file.
         String filename = args[0].substring( 1 + args[0].indexOf('\\'), args[0].indexOf(".") );
         filename += "_.obj";

         // Check if the output file already exits.
         try
         {
            fis = new FileInputStream(filename);
            System.err.printf("ERROR! OBJ file already exits: %s\n", filename);
            System.exit(-1);
         }
         catch (FileNotFoundException e)
         {
         }

         // Create the output file.
         FileOutputStream fos = null;
         try  // open the file
         {
            fos = new FileOutputStream(filename);
         }
         catch (FileNotFoundException e)
         {
            e.printStackTrace(System.err);
            System.err.printf("ERROR! Could not open file %s\n", filename);
            System.exit(-1);
         }
         System.err.printf("Created file %s\n", filename);


         // Open the file named on the command line.
         try
         {
            fis = new FileInputStream(args[0]);
         }
         catch (FileNotFoundException e)
         {
            e.printStackTrace(System.err);
            System.err.printf("ERROR! Could not open OBJ file: %s\n", args[0]);
            System.exit(-1);
         }


         // Re-read the input file and rescale it into the output file.
         try
         {
            PrintStream ps = new PrintStream( fos );
            Scanner scanner = new Scanner(fis);
            while ( scanner.hasNext() )
            {
               String token = scanner.next();
               if ( token.startsWith("#")
                 || token.startsWith("vt")
                 || token.startsWith("vn")
                 || token.startsWith("f")
                 || token.startsWith("s")
                 || token.startsWith("g")
                 || token.startsWith("o")
                 || token.startsWith("usemtl")
                 || token.startsWith("mtllib") )
               {
                  String oneLine = scanner.nextLine();
                  ps.println( token + " " + oneLine );
               }
               else if ( token.startsWith("v") )
               {
                  double x = scanner.nextDouble();
                  double y = scanner.nextDouble();
                  double z = scanner.nextDouble();

                  x *= scaleFactor;
                  y *= scaleFactor;
                  z *= scaleFactor;

                  ps.printf("v % .6f  % .6f  % .6f\n", x, y, z);

                  //System.err.printf("v % .4f  % .4f  % .4f\n", x, y, z);
               }
               else
               {
                  String oneLine = scanner.nextLine();
                  ps.println(token + oneLine);
                  System.err.println(token + oneLine);  // and log unknown lines
               }
            }
            fis.close();
            fos.close();
         }
         catch (IOException e)
         {
            System.err.printf("ERROR! Could not write OBJ file: %s\n", filename);
            e.printStackTrace(System.err);
            System.exit(-1);
         }
      }
   }
}