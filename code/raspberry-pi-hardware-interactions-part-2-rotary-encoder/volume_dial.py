import time
import alsaaudio
import RPi.GPIO as GPIO


MIXER = alsaaudio.Mixer(control="PCM", id=0, cardindex=-1, device="default")
INCREMENT = 3
MIN_VOLUME = 0
MAX_VOLUME = 100


def raise_volume():
    current_volume = MIXER.getvolume()[0]
    if current_volume + INCREMENT > MAX_VOLUME:
        MIXER.setvolume(MAX_VOLUME)
    else:
        MIXER.setvolume(current_volume + INCREMENT)


def lower_volume():
    current_volume = MIXER.getvolume()[0]
    if current_volume - INCREMENT < MIN_VOLUME:
        MIXER.setvolume(MIN_VOLUME)
    else:
        MIXER.setvolume(current_volume - INCREMENT)


def handle_pulse_event():
    if GPIO.input(18):
        lower_volume()
    else:
        raise_volume()


GPIO.setmode(GPIO.BOARD)

GPIO.setup(16, GPIO.IN)
GPIO.setup(18, GPIO.IN)

GPIO.add_event_detect(16, GPIO.RISING, callback=handle_pulse_event)

while True:
    time.sleep(0.2)
