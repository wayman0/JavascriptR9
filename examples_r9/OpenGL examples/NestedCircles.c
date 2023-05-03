/*

*/
#include <math.h>

#if defined _WIN32 || defined _WIN64
#  include <windows.h>
#endif

#ifdef __APPLE__
#  include <GLUT/glut.h>
#else
#  include <GL/glut.h>
#endif

#include "glui.h"

#define PI 3.14159265

/* GLUT callback function prototypes */
void display(void);
void reshape(int, int);
void slider1(float);
void slider2(float);
void slider3(float);
void slider4(float);

int windowHeight;         // this is set by the glut reshape() callback function
int windowWidth;          // this is set by the glut reshape() callback function

#define sliderInit 0.0
float sliderValue1 = sliderInit;  // this is set by the glui slider1() callback function
float sliderValue2 = sliderInit;  // this is set by the glui slider2() callback function
float sliderValue3 = sliderInit;  // this is set by the glui slider3() callback function
float sliderValue4 = sliderInit;  // this is set by the glui slider3() callback function

int main(int argc, char** argv)
{
   int window;
   glutInit(&argc, argv);
   glutInitDisplayMode(GLUT_DOUBLE | GLUT_RGB);  // glui needs double buffering!
   // specify the screen window
   glutInitWindowSize(500,580);       // width, height (in pixels)
   glutInitWindowPosition(100,150);   // left, top (in pixels)
   window = glutCreateWindow("Nested Circles");
   glutDisplayFunc(display);
   glutReshapeFunc(reshape);
   /* set up viewing */
   glMatrixMode(GL_PROJECTION);
   glLoadIdentity();
   gluOrtho2D(-5.0, 5.0, -5.0, 5.0); /* viewing volume */
   glMatrixMode(GL_MODELVIEW);

   // parent window, x, y, width, height, initial value, callback function
   gluiHorizontalSlider(window, 10,  0, -10, 20, sliderInit, slider1);
   gluiHorizontalSlider(window, 10, 20, -10, 20, sliderInit, slider2);
   gluiHorizontalSlider(window, 10, 40, -10, 20, sliderInit, slider3);
   gluiHorizontalSlider(window, 10, 60, -10, 20, sliderInit, slider4);

   glClearColor(1.0, 1.0, 1.0, 0.0);
   glLineWidth(1.0);

   glutMainLoop( );

   return 0;
}//main()

void circle()
{
   int n;

   glBegin(GL_LINE_LOOP);
     for (n = 0; n <= 100; n++)
        glVertex2f(cos((n/(double)100)*2*PI), sin((n/(double)100)*2*PI));
   glEnd();
}


void display(void)
{
   // specify the viewport
   glViewport( 0,  0, windowWidth, windowHeight-60); // left, bottom, width, height (in pixels)

   glClear( GL_COLOR_BUFFER_BIT );

   glMatrixMode(GL_MODELVIEW);
   glLoadIdentity();

   glPushMatrix();
     glColor3f(1.0, 0.0, 0.0);     /* draw in red */
     glScalef(3.0, 3.0, 1.0);
     circle();
   glPopMatrix();

   glRotatef(sliderValue1*360.0, 0.0, 0.0, 1.0);
   glTranslatef(3.0, 0.0, 0.0);

   glPushMatrix();
     glPushMatrix();
       glColor3f(0.0, 0.0, 1.0);     /* draw in blue */
       glScalef(0.75, 0.75, 1.0);
       circle();
     glPopMatrix();

     glRotatef(sliderValue2*360.0, 0.0, 0.0, 1.0);
     glTranslatef(0.75, 0.0, 0.0);

     glColor3f(0.0, 1.0, 0.0);     /* draw in green */
     glScalef(0.2, 0.3, 1);
     circle();
   glPopMatrix();


   glPushMatrix();
     glPushMatrix();
       glColor3f(0.0, 0.0, 1.0);     /* draw in blue */
       glScalef(1.5, 1.5, 1.0);
       circle();
     glPopMatrix();

     glRotatef(sliderValue3*360.0, 0.0, 0.0, 1.0);
     glTranslatef(1.5, 0.0, 0.0);

     glPushMatrix();
       glColor3f(0.0, 1.0, 0.0);     /* draw in green */
       glScalef(0.3, 0.3, 1);
       circle();
     glPopMatrix();

     glRotatef(sliderValue4*360.0, 0.0, 0.0, 1.0);
     glTranslatef(0.3, 0.0, 0.0);

     glColor3f(1.0, 0.0, 1.0);     /* draw in purple */
     glScalef(0.2, 0.1, 1);
     circle();
   glPopMatrix();

   glutSwapBuffers();  // glui needs double buffering!
}


/* The reshape() callback function */
void reshape(int width, int height)
{
   windowWidth  = width;
   windowHeight = height;

   printf("We got a \"reshape(%d, %d)\" event\n", width, height);

   gluiReshape(width, height);  // notice the difference here
}//reshape()


/* glui slider callback function */
void slider1(float value)
{
   sliderValue1 = value;

   printf("We got a \"slider1(%f)\" event\n", value);

   glutPostRedisplay();  // notice the difference here
}//slider1()

/* glui slider callback function */
void slider2(float value)
{
   sliderValue2 = value;

   printf("We got a \"slider2(%f)\" event\n", value);

   glutPostRedisplay();  // notice the difference here
}//slider2()

/* glui slider callback function */
void slider3(float value)
{
   sliderValue3 = value;

   printf("We got a \"slider3(%f)\" event\n", value);

   glutPostRedisplay();  // notice the difference here
}//slider3()

/* glui slider callback function */
void slider4(float value)
{
   sliderValue4 = value;

   printf("We got a \"slider4(%f)\" event\n", value);

   glutPostRedisplay();  // notice the difference here
}//slider4()