import signal
import sys
import time as t
import numpy as np
from sparkpost import SparkPost
import os
#import smtplib
import matplotlib.pyplot as plt
#import smtplib
#from email.MIMEMultipart import MIMEMultipart
#from email.MIMEText import MIMEText
#from email.MIMEBase import MIMEBase
#from email import encoders
from liblo import *
user_email = ""
sp = SparkPost('e138fa5880618351f5be5a072c7a2b4f58cd91ec')

INTERVAL = 100 
MAX_SD_SUM = 200


'''
def send_email_notif():
    fromaddr = ""
    toaddr = user_email
 
    msg = MIMEMultipart()
 
    msg['From'] = fromaddr
    msg['To'] = toaddr
    msg['Subject'] = "Cognitive health session report"
     
    body = "Please find attached the report"
 
    msg.attach(MIMEText(body, 'plain'))
 
    filename = "report.png"
    attachment = open("EEG.png", "rb")
 
    part = MIMEBase('application', 'octet-stream')
    part.set_payload((attachment).read())
    encoders.encode_base64(part)
    part.add_header('Content-Disposition', "attachment; filename= %s" % filename)
 
    msg.attach(part)
 
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(fromaddr, "")
    text = msg.as_string()
    server.sendmail(fromaddr, toaddr, text)
    server.quit()
'''
def send_email_notif():
    response = sp.transmissions.send(
            recipients=['pkattep@ncsu.edu'],
            html='<p>Greetings from Cogniwave</p>',
            from_email='sandbox@sparkpostbox.com',
            subject='Please find your report attached',
            attachments=[{
                "name": "eeg.png",
                "type": "img/png",
                "filename": "EEG.png"}]
            )
    print response

def signal_handler(signal, frame):
    send_email_notif()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)

EEG = [0]*4
EEG_SD = [0]*4

plt.ion()
plt.ylim([50,1000])

for i in range(4):
    EEG[i]= [0] * INTERVAL
    EEG_SD[i]= [0] * INTERVAL

line_le, = plt.plot(EEG_SD[0])
line_lf, = plt.plot(EEG_SD[1])
line_re, = plt.plot(EEG_SD[2])
line_rf, = plt.plot(EEG_SD[3])

plt.draw()
plt.legend(['Left Ear', 'Left Forehead', 'Right Ear', 'Right Forehead'], loc='upper left')
plt.pause(0.1)


class MuseServer(ServerThread):
    #listen for messages on port 5000
    def __init__(self):
        ServerThread.__init__(self, 6000)
        print "Initialised"
    
    #receive accelrometer data
    #@make_method('/muse/acc', 'fff')
    #def acc_callback(self, path, args):
    #    acc_x, acc_y, acc_z = args
    #   print "hello"
    #    print "%s %f %f %f" % (path, acc_x, acc_y, acc_z)

    #receive EEG data
    @make_method('/muse/eeg', 'ffff')
    def eeg_callback(self, path, args):
        global MAX_SD_SUM
        l_ear, l_forehead, r_forehead, r_ear = args
        EEG[0].append(l_ear)
        EEG[1].append(l_forehead)
        EEG[2].append(r_ear)
        EEG[3].append(r_forehead)
        
       
        sd_sum = 0.0
        for i in range(4):
            del EEG[i][0]
            del EEG_SD[i][0]
            EEG_SD[i].append(np.std(EEG[i]))
            sd_sum += EEG_SD[i][-1]
        
        
        line_le.set_ydata(EEG_SD[0])
        line_lf.set_ydata(EEG_SD[1])
        line_re.set_ydata(EEG_SD[2])
        line_rf.set_ydata(EEG_SD[3])
        plt.draw()
        plt.pause(0.1)
        if MAX_SD_SUM<sd_sum:
            MAX_SD_SUM = sd_sum
            plt.savefig("EEG.png")
        
   

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
