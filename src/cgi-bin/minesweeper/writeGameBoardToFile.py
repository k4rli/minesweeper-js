#!/usr/bin/python
import cgi
import cgitb

cgitb.enable()

print "Content-type: text/html"
print

data = cgi.FieldStorage()
username = data["username"].value

with open ('/home/kaudso/public_html/prax3/savegames/' + username + '_board.txt','w+') as fileOutput:
    fileOutput.write(data["boardText"].value)
