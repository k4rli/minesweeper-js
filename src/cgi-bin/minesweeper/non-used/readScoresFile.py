#!/usr/bin/python
import cgi
import cgitb
import random

cgitb.enable()

print "Content-type: text/html"
print
print "<html><head><title>R E A D F I L E</title></head>"
string = ""
for ch in "this is where reading file magic happens":
    string = string + ch + " " 
print "<body><h1>" + string + "</h1>"


data = cgi.FieldStorage()

with open('scores.txt') as f:  
   line = f.readline()
   count = 1
   while line:
       print("{}: {}".format(count, line.strip()))
       print("<br>")
       line = f.readline()
       count += 1


print "</p></body>"
