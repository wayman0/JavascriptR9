#
# Use this makefile with the command
#    C:\cs45500\MinGW32\bin\mingw32-make
#
CC = C:\cs45500\MinGW32\bin\gcc
CPP = C:\cs45500\MinGW32\bin\g++
CFLAGS = -Wall -g

# This special target is needed because exe is not a "known suffix" in Unix.
.SUFFIXES: .exe

# See Section 5.4.3 of "GNU Make Manual"
# 08 July 2002, GNU make Version 3.80.
all: $(patsubst %.c,%.exe,$(wildcard *.c)) $(patsubst %.cpp,%.exe,$(wildcard *.cpp))

# Use a simple suffix rule to compile any c file.
# See Section 11.7 of "GNU Make Manual"
# 08 July 2002, GNU make Version 3.80.
.c.exe:
	$(CC) $(CFLAGS) -o $@ $< -lpthread -lopengl32 -lglu32 -lglut32

.cpp.exe:
	$(CPP) $(CFLAGS) -o $@ $< -lpthread -lopengl32 -lglu32 -lglut32

# delete only the files that we made
clean:
	cmd /c del $(patsubst %.c,%.exe,$(wildcard *.c)) $(patsubst %.cpp,%.exe,$(wildcard *.cpp))
