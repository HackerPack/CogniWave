import sys
import time as t
import datetime
from firebase import firebase
from liblo import *

user_email = ""
firebase = firebase.FirebaseApplication('https://cogniwave.firebaseio.com')

class MuseServer(ServerThread):
    #listen for messages on port 5000
    def __init__(self):
        ServerThread.__init__(self, 6000)
        self.blink_count=0
        print "Initialised"
    
   
    @make_method('/muse/elements/blink','i')
    def blink_callback(self, path, args):
        print "IT'S A BLINK CALL!!!"
        #global firebase,user_email
        blink_val = args
        if args[0]:
            print "IT'S A BLINK CALL TRUE!!!"
            if(self.blink_count==0):
                self.time = datetime.datetime.now()
            self.blink_count += 1 
            if(self.blink_count==4):
                temp = datetime.datetime.now() - self.time
                if(temp.seconds<=3):
                    data={'email':user_email,'message':'Emergency Message'}
                    result = firebase.put('/Messages','data', data)
                    #result = firebase.post('/strings', data={"whatever":"data"}, params={'print': 'pretty'})
                    #result = firebase.post('/users', user_email,{'message':'This is and alert message.'}, {'print': 'pretty'}, {'X_FANCY_HEADER': 'VERY FANCY'})
                self.blink_count=0

if len(sys.argv)<2:
    print "<Usage> python muse_pyliblo_server.py <emailId>"
    exit(1)

user_email = sys.argv[1]
try:
    server = MuseServer()
except ServerError, err:
    print str(err)
    sys.exit()


server.start()

if __name__ == "__main__":
    while 1:
        t.sleep(1)
