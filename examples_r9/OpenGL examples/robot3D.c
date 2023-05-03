/*
   This is my refactored version of
      Example 3-7 : Robot Arm: robot.c
   from
     OpenGL Programming Guide
       Chapter 3, Viewing
         Examples of Composing Several Transformations
           Building an Articulated Robot Arm

   http://www.glprogramming.com/red/chapter03.html#name8
*/

#if defined _WIN32 || defined _WIN64
#  include <windows.h>
#endif

#ifdef __APPLE__
#  include <GLUT/glut.h>
#else
#  include <GL/glut.h>
#endif

static int shoulder = 0, elbow = 0;
static float upperArmLength = 2.0;
static float lowerArmLength = 2.0;

void init(void)
{
  glClearColor (0.0, 0.0, 0.0, 0.0);
  glShadeModel (GL_FLAT);
}

void beam(float length)
{
   glPushMatrix();
     glTranslatef (1.0, 0.0, 0.0);
     glScalef (length, 0.4, 1.0);
     glutWireCube (1.0);
   glPopMatrix();
}

void display(void)
{
   glClear (GL_COLOR_BUFFER_BIT);
   glPushMatrix();

   // this is transformation 1; a rotation about the origin
   glRotatef ((GLfloat) shoulder, 0.0, 0.0, 1.0);

   beam(upperArmLength); // object 1, the upper arm

   // this is transformation 2; move to the end of the upper arm, then rotate
   glTranslatef (upperArmLength, 0.0, 0.0);
   glRotatef ((GLfloat) elbow, 0.0, 0.0, 1.0);

   beam(lowerArmLength); // object 2, the lower arm

   glPopMatrix();
   glutSwapBuffers();
}

void reshape (int w, int h)
{
   glViewport (0, 0, (GLsizei) w, (GLsizei) h);
   glMatrixMode (GL_PROJECTION);
   glLoadIdentity ();
   gluPerspective(65.0, (GLfloat) w/(GLfloat) h, 1.0, 20.0);
   glMatrixMode(GL_MODELVIEW);
   glLoadIdentity();
   glTranslatef (0.0, 0.0, -5.0);
}

void keyboard (unsigned char key, int x, int y)
{
   switch (key) {
      case 's':   /*  s key rotates at shoulder  */
         shoulder = (shoulder + 5) % 360;
         glutPostRedisplay();
         break;
      case 'S':
         shoulder = (shoulder - 5) % 360;
         glutPostRedisplay();
         break;
      case 'e':  /*  e key rotates at elbow  */
         elbow = (elbow + 5) % 360;
         glutPostRedisplay();
         break;
      case 'E':
         elbow = (elbow - 5) % 360;
         glutPostRedisplay();
         break;
      default:
         break;
   }
}

int main(int argc, char** argv)
{
   glutInit(&argc, argv);
   glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGB);
   glutInitWindowSize (500, 500);
   glutInitWindowPosition (100, 100);
   glutCreateWindow (argv[0]);
   init ();
   glutDisplayFunc(display);
   glutReshapeFunc(reshape);
   glutKeyboardFunc(keyboard);
   glutMainLoop();
   return 0;
}