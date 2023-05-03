/*
   When you have two matrices A and B and a vector v, there are
   two ways to think about the transformation ABv. You can either
   read it from right to left and give it one interpretation, or
   you can read it from left to right with a different interpretation.

   When you read ABv from right to left, you think of a global, fixed
   coordinated system, and then you start with the vector v, transform
   it to the vector Bv and then transform that into the vector A(Bv),
   always working in the fixed, global (or world) coordinate system.

   When you read ABv from left to right, you think of changing (or moving)
   coordinate systems. You start with some given coordinate system, then
   the matrix A moves that to a second coordinate system, then matrix B
   moves the second coordinate system to a third coordinate system, and
   then the vector v is plotted in the third coordinate system.

   The previous example program, model-transformed.c, emphasized the right
   to left way of thinking about transformations. This program is an example
   where the left to right way of thinking works better.

   The idea behind this example is briefly explained in the "Red Book"
   at the URL
        http://www.glprogramming.com/red/chapter03.html#name2
   In particular, be sure to read the following three sections:
     "Thinking about Transformations"
     "Grand, Fixed Coordinate System"
     "Moving a Local Coordinate System"


   This code based on  http://www.glprogramming.com/red/chapter03.html#name8
*/
#include <stdio.h>

#if defined _WIN32 || defined _WIN64
#  include <windows.h>
#endif

#ifdef __APPLE__
#  include <GLUT/glut.h>
#else
#  include <GL/glut.h>
#endif


/* Prototype for the display callback function */
void display( void );

/* Prototype for the keyboard callback function */
void keyboard (unsigned char, int, int);


static int shoulder = 0, elbow = 0, wrist = 0, finger = 0;


int main(int argc, char** argv)
{
   glutInit(&argc, argv);
   glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);
   glutInitWindowSize (500, 500);
   glutInitWindowPosition (100, 100);
   glutCreateWindow (argv[0]);
   glutDisplayFunc(display);
   glutKeyboardFunc(keyboard);
   /* Initialize OpenGL state */
   /* attributes */
   glClearColor(1.0, 1.0, 1.0, 1.0); /* white background */
   /* set up viewing */
   glMatrixMode(GL_PROJECTION);
   glLoadIdentity();
   gluOrtho2D(-10.0, 10.0, -10.0, 10.0); /* viewing volume */

   /* Enter event loop */
   glutMainLoop();

   return 0;  /* we never get here */
}


void display(void)
{
   glClear(GL_COLOR_BUFFER_BIT);

   glMatrixMode(GL_MODELVIEW);
   glLoadIdentity();

   glColor3f(1.0, 0.0, 0.0);         /* draw in red */

   // we start with a coordinate system with its origin
   // at the location of the "shoulder"
   glRotatef((GLfloat) shoulder, 0.0, 0.0, 1.0);
   glBegin(GL_LINES);
     glVertex2f( 0.0,  0.0);    // shoulder-to-elbow line segment
     glVertex2f( 4.0,  0.0);
   glEnd();
   glTranslatef(4.0, 0.0, 0.0); // move the coordinate system to the elbow

   glRotatef((GLfloat) elbow, 0.0, 0.0, 1.0);
   glBegin(GL_LINES);
     glVertex2f( 0.0,  0.0);    // elbow-to-wrist line segment
     glVertex2f( 3.0,  0.0);
   glEnd();
   glTranslatef(3.0, 0.0, 0.0); // move the coordinate system to the wrist

   glRotatef((GLfloat) wrist, 0.0, 0.0, 1.0);
   glBegin(GL_LINES);
     glVertex2f( 0.0,  0.0);    // wrist-to-finger line segment
     glVertex2f( 2.0,  0.0);
   glEnd();
   glTranslatef(2.0, 0.0, 0.0); // move the coordinate system to the finger

   glRotatef((GLfloat) finger, 0.0, 0.0, 1.0);
   glBegin(GL_LINES);
     glVertex2f( 0.0,  0.0);    // finger line segment
     glVertex2f( 1.0,  0.0);
   glEnd();
   glTranslatef(1.0, 0.0, 0.0); // move the coordinate system to the finger tip
                                // (not really needed)
/*
   Notice that every one of the above four line segments is drawn along the
   x-axis. But in each case, tranformations (a rotation and a translation)
   have moved the origin and direction of the x-axis.
*/
   glFlush(); /* clear buffers */
}


void keyboard (unsigned char key, int x, int y)
{
   switch (key)
   {
      case 's':   /* s key rotates at shoulder  */
         shoulder = (shoulder + 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      case 'S':
         shoulder = (shoulder - 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      case 'e':  /* e key rotates at elbow  */
         elbow = (elbow + 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      case 'E':
         elbow = (elbow - 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      case 'w':   /* w key rotates at wrist  */
         wrist = (wrist + 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      case 'W':
         wrist = (wrist - 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      case 'f':  /* f key rotates at finger  */
         finger = (finger + 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      case 'F':
         finger = (finger - 5) % 360;
         printf("shoulder = %d, elbow = %d, wrist = %d, finger = %d\n",
                 shoulder, elbow, wrist, finger);
         glutPostRedisplay();
         break;
      default:
         break;
   }
}

