#!/usr/bin/python
import cgi
import cgitb
from time import strftime, localtime

cgitb.enable()

print "Content-type: text/html"
print
string = ""

data = cgi.FieldStorage()

with open ('/home/kaudso/public_html/prax3/scores.txt','a+') as fileOutput:
    fileOutput.write(strftime("%d %b %Y %X", localtime()) + " :: " + data["name"].value + " " + data["result"].value + " the game in " + data["moves"].value + " moves on a " + data["boardSize"].value + " by " + data["boardSize"].value + " board.<br>\n")

