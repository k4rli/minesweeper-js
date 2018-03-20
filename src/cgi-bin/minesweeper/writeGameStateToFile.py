#!/usr/bin/python
import cgi
import cgitb
import json

cgitb.enable()

print "Content-type: application/json"
print
string = ""

data = cgi.FieldStorage()
jsonText = json.loads(str(data)[26:-2])
name = str(jsonText['name'])


with open ('/home/kaudso/public_html/prax3/savegames/' + name + '.json','w+') as fileOutput:
    str = str(jsonText).replace("'", '"')
    fileOutput.write(str.replace('u"', '"'))
