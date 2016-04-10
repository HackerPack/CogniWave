from liblo import *
import matplotlib.pyplot as plt

import sys
import time
import numpy as np


plt.ion()
plt.ylim([50,1000])
INTERVAL = 100 
sum_sd = 0.0

eeg_le = [0] * INTERVAL
eeg_lf = [0] * INTERVAL
eeg_re = [0] * INTERVAL
eeg_rf = [0] * INTERVAL

eeg_le_sd = [0] * INTERVAL
eeg_lf_sd = [0] * INTERVAL
eeg_re_sd = [0] * INTERVAL
eeg_rf_sd = [0] * INTERVAL

line_le, = plt.plot(eeg_le_sd)
line_lf, = plt.plot(eeg_lf_sd)
line_re, = plt.plot(eeg_re_sd)
line_rf, = plt.plot(eeg_rf_sd)

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
        l_ear, l_forehead, r_forehead, r_ear = args
        eeg_le.append(l_ear)
        eeg_lf.append(l_forehead)
        eeg_re.append(r_ear)
        eeg_rf.append(r_forehead)
        
        # print "LE = ",np.std(eeg_le)
        # print "LF = ",np.std(eeg_lf)
        # print "RE = ",np.std(eeg_re)
        # print "RF = ",np.std(eeg_rf)
        del eeg_le[0]
        del eeg_lf[0]
        del eeg_re[0]
        del eeg_rf[0]

        del eeg_le_sd[0]
        del eeg_lf_sd[0]
        del eeg_re_sd[0]
        del eeg_rf_sd[0]

        eeg_le_sd.append(np.std(eeg_le))
        eeg_lf_sd.append(np.std(eeg_lf))
        eeg_re_sd.append(np.std(eeg_re))
        eeg_rf_sd.append(np.std(eeg_rf))
        
        line_le.set_ydata(eeg_le_sd)
        line_lf.set_ydata(eeg_lf_sd)
        line_re.set_ydata(eeg_re_sd)
        line_rf.set_ydata(eeg_rf_sd)
        plt.draw()

        plt.pause(0.1)
    
    #print "hello123"
        #print "%s %f %f %f %f" % (path, l_ear, l_forehead, r_forehead, r_ear)

    #handle unexpected messages
    #@make_method(None, None)
    #def fallback(self, path, args, types, src):
    #    print "Unknown message \
    #    \n\t Source: '%s' \
    #    \n\t Address: '%s' \
    #    \n\t Types: '%s ' \
    #    \n\t Payload: '%s'" \
    #    % (src.url, path, types, args)

    #receive blink data
    @make_method('/muse/elements/blink','receive')
    def blink_callback(self, path, args):
        blink_val = args
        print "BLINK!!!! %s %r" % (path, blink_val)

try:
    server = MuseServer()
except ServerError, err:
    print str(err)
    sys.exit()


server.start()

if __name__ == "__main__":
    while 1:
        time.sleep(1)
