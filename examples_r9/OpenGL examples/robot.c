/*
 * Copyright (c) 1993-1997, Silicon Graphics, Inc.
 * ALL RIGHTS RESERVED 
 * Permission to use, copy, modify, and distribute this software for 
 * any purpose and without fee is hereby granted, provided that the above
 * copyright notice appear in all copies and that both the copyright notice
 * and this permission notice appear in supporting documentation, and that 
 * the name of Silicon Graphics, Inc. not be used in advertising
 * or publicity pertaining to distribution of the software without specific,
 * written prior permission. 
 *
 * THE MATERIAL EMBODIED ON THIS SOFTWARE IS PROVIDED TO YOU "AS-IS"
 * AND WITHOUT WARRANTY OF ANY KIND, EXPRESS, IMPLIED OR OTHERWISE,
 * INCLUDING WITHOUT LIMITATION, ANY WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE.  IN NO EVENT SHALL SILICON
 * GRAPHICS, INC.  BE LIABLE TO YOU OR ANYONE ELSE FOR ANY DIRECT,
 * SPECIAL, INCIDENTAL, INDIRECT OR CONSEQUENTIAL DAMAGES OF ANY
 * KIND, OR ANY DAMAGES WHATSOEVER, INCLUDING WITHOUT LIMITATION,
 * LOSS OF PROFIT, LOSS OF USE, SAVINGS OR REVENUE, OR THE CLAIMS OF
 * THIRD PARTIES, WHETHER OR NOT SILICON GRAPHICS, INC.  HAS BEEN
 * ADVISED OF THE POSSIBILITY OF SUCH LOSS, HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, ARISING OUT OF OR IN CONNECTION WITH THE
 * POSSESSION, USE OR PERFORMANCE OF THIS SOFTWARE.
 * 
 * US Government Users Restricted Rights 
 * Use, duplication, or disclosure by the Government is subject to
 * restrictions set forth in FAR 52.227.19(c)(2) or subparagraph
 * (c)(1)(ii) of the Rights in Technical Data and Computer Software
 * clause at DFARS 252.227-7013 and/or in similar or successor
 * clauses in the FAR or the DOD or NASA FAR Supplement.
 * Unpublished-- rights reserved under the copyright laws of the
 * United States.  Contractor/manufacturer is Silicon Graphics,
 * Inc., 2011 N.  Shoreline Blvd., Mountain View, CA 94039-7311.
 *
 * OpenGL(R) is a registered trademark of Silicon Graphics, Inc.
 */

/*
 * robot.c
 * This program shows how to composite modeling transformations
 * to draw translated and rotated hierarchical models.
 * Interaction:  pressing the s and e keys (shoulder and elbow)
 * alters the rotation of the robot arm.

 *

 * This has been modified from the redbook example for EECS-487

 * Interactive Computer Graphics  JWH 10/03/02

 *
 */
#include <windows.h>
#include <GL/glut.h>
#include <stdlib.h>

static int shoulder = 0, elbow = 0;
static int anim = 0;

void init(void) 
{
   GLfloat position[] = {0.0, 100.0, 200.0, 0.0};

   GLfloat diff[] = {0.5,0.5,0.5, 1.0};

   GLfloat amb[] = {0.2,0.2,0.2, 1.0};

   GLfloat lmamb[] = {0.2,0.2,0.2, 1.0};

   GLfloat spec[] = {0.5,0.5,0.5,1.0};

   GLint shin = {5};

   glClearColor (0.0, 0.0, 0.0, 0.0);



   glMaterialfv(GL_FRONT, GL_AMBIENT, amb);

   glMaterialfv(GL_FRONT, GL_DIFFUSE, diff);

   glMaterialfv(GL_FRONT, GL_SPECULAR, spec);

   glMateriali (GL_FRONT,GL_SHININESS, shin);

   glLightfv (GL_LIGHT0, GL_POSITION, position);

   glLightModelfv (GL_LIGHT_MODEL_AMBIENT, lmamb);
   

   glEnable(GL_LIGHTING);

   glEnable(GL_LIGHT0);

   glEnable(GL_DEPTH_TEST);

   glShadeModel (GL_SMOOTH);

   //glColorMaterial(GL_FRONT, GL_DIFFUSE);

   glEnable(GL_NORMALIZE);
   glEnable(GL_COLOR_MATERIAL);
}

void display(void)
{

   
   glClear (GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

   glColor4f (0.2, 0.2, 1.0, 1.0);



   glPushMatrix();

   glRotatef (25, 1.0, 1.0, 0.0);


   glTranslatef (-1.0, 0.0, 0.0);
   glRotatef ((GLfloat) shoulder, 0.0, 0.0, 1.0);
   glTranslatef (1.0, 0.0, 0.0);
   glPushMatrix();
   glScalef (2.0, 0.4, 1.0);
   glutSolidCube (1.0);
   glPopMatrix();

   glTranslatef (1.0, 0.0, 0.0);
   glRotatef ((GLfloat) elbow, 0.0, 0.0, 1.0);
   glTranslatef ( 0.8, 0.0, 0.0);
   glPushMatrix();
   glScalef (2.0, 0.4, 1.0);

   glutSolidCube (1.0);

   glPopMatrix();

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
      case 's':
         shoulder = (shoulder + 5) % 360;
         glutPostRedisplay();
         break;
      case 'S':
         shoulder = (shoulder - 5) % 360;
         glutPostRedisplay();
         break;
      case 'e':
         elbow = (elbow + 5) % 360;
         glutPostRedisplay();
         break;
      case 'E':
         elbow = (elbow - 5) % 360;
         glutPostRedisplay();
         break;
      case 'A':
          anim = 1;
          break;
      case 'a':
          anim = 0;
          break;
      case 27:
         exit(0);
         break;
      default:
         break;
   }
}

void Animate()
{
    int i;
    if(anim == 1) {
        //for (i=0; i<100; i++) {
         shoulder = (shoulder + 2) % 360;
         elbow = (elbow + 2) % 360;
       // }
         glutPostRedisplay();
    }
}

int main(int argc, char** argv)
{
   glutInit(&argc, argv);
   glutInitDisplayMode (GLUT_DOUBLE | GLUT_RGBA | GLUT_DEPTH);
   glutInitWindowSize (500, 500); 
   glutInitWindowPosition (100, 100);
   glutCreateWindow (argv[0]);
   init ();
   glutDisplayFunc(display); 
   glutReshapeFunc(reshape);
   glutKeyboardFunc(keyboard);
   glutIdleFunc(Animate);
   glutMainLoop();
   return 0;
}
