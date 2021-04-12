package apa102;

import com.pi4j.io.spi.SpiChannel;
import com.pi4j.io.spi.SpiDevice;
import com.pi4j.io.spi.SpiFactory;
import com.pi4j.io.spi.SpiMode;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

/**
 * Driver for the APA102 RGB LED. An LED will display the last colour data stored as long as power is present. Each LED
 * has two modes, data forwarding or data storing.
 *
 * Data forwarding mode:
 * This is the default mode, in which each LED will write all data read from the Din pin to its Dout pin.
 *
 * Data storing mode:
 * This mode is activated by receiving 4 bytes of 0x00. In this mode, an LED will store the next 4 bytes of data
 * from the Din pin, while simultaneously writing 4 bytes of 0x00 to its Dout pin. Once the 4 bytes of data have been
 * stored the LED will return to forwarding mode.
 *
 * Data communication:
 * Each LED in a APA102 strip reads bits on the Din pin on a rising edge of the input clock. On the falling edge of the
 * same input clock cycle, a bit (depending on the mode) is written to the Dout pin and its output clock is immediately
 * toggled, resulting in the same operation being performed by the next LED in the line. It is important to realise that
 * this operation causes the input and output clocks to be out of sync by half a cycle.
 */
public class APA102 {

    // Brightness
    private static final int BRIGHTNESS_BITS = 5;
    private static final int BRIGHTNESS_SHIFT = (8 - BRIGHTNESS_BITS);
    private static final int MIN_BRIGHTNESS = 0;
    private static final int MAX_BRIGHTNESS = (1 << BRIGHTNESS_BITS) - 1;

    // APA102 Packet
    private static final int FRAME_SIZE_BYTES = 4;
    private static final byte LED_FRAME_START = (byte) 0xE0;
    private static final byte[] START_FRAME = {0x00, 0x00, 0x00, 0x00};

    // SPI Settings
    private static final SpiChannel SPI_CHANNEL = SpiChannel.CS0;
    private static final SpiMode SPI_MODE = SpiDevice.DEFAULT_SPI_MODE;
    private static final int SPI_SPEED = SpiDevice.DEFAULT_SPI_SPEED;

    private final SpiDevice spiDevice;

    /**
     * Constructs a new APA102 instance.
     *
     * @throws IOException When the SPI bus cannot be connected to.
     */
    public APA102() throws IOException {
        this.spiDevice = SpiFactory.getInstance(APA102.SPI_CHANNEL, APA102.SPI_SPEED, APA102.SPI_MODE);
    }

    /**
     * Writes a packet of data provided onto the SPI bus to drive a strip of APA102 LEDs. The packet consists of a start
     * frame, LED frames equal to the number of colours provided, and an end frame.
     *
     * @param colours The desired colours to write to the LED strip in order of index 0 - LED 1, index 1 - LED 2 etc.
     * @throws IOException If the SPI bus cannot be written to.
     */
    public void writeToStrip(List<Colour> colours) throws IOException {
        byte[] endFrame = APA102.createEndFrame(colours.size());
        byte[] packet = new byte[APA102.START_FRAME.length + colours.size() * APA102.FRAME_SIZE_BYTES + endFrame.length];

        System.arraycopy(APA102.START_FRAME, 0, packet, 0, APA102.START_FRAME.length);
        System.arraycopy(endFrame, 0, packet, packet.length - endFrame.length, endFrame.length);

        for (int i = 0; i < colours.size(); i++) {
            byte[] ledFrame = this.createLedFrame(colours.get(i));
            System.arraycopy(ledFrame, 0, packet, APA102.START_FRAME.length + i * APA102.FRAME_SIZE_BYTES, ledFrame.length);
        }

        int writtenBytes = 0;
        while (writtenBytes < packet.length) {
            this.spiDevice.write(packet, writtenBytes, SpiDevice.MAX_SUPPORTED_BYTES);
            writtenBytes += SpiDevice.MAX_SUPPORTED_BYTES;
        }
    }

    /**
     * Creates an LED frame for a given colour. The first byte of the frame consists of three 1's and 5 bits of
     * brightness. The next three bytes are the amount of blue, green and red light respectively.
     *
     * @param colour The desired colour of the LED.
     * @return An LED frame.
     */
    private byte[] createLedFrame(Colour colour) {
        final byte brightness = (byte)((Byte.toUnsignedInt(colour.brightnessByte) >> BRIGHTNESS_SHIFT));
        assert Byte.toUnsignedInt(brightness) <= MAX_BRIGHTNESS;
        final byte ledFrameStart = (byte) (APA102.LED_FRAME_START | brightness);
        return new byte[]{ledFrameStart, colour.blueByte, colour.greenByte, colour.redByte};
    }

    /**
     * Constructs an end frame for a packet. The end frame is of varying size with respect to the number of LED frames
     * in the packet. This is due to the design of the APA102 data communication protocol. As explained previously, for
     * each LED in a strip the SPI clock will become out of sync by half a cycle. We can come to the definition of for
     * every 2 LEDs out clocks go out of sync by 1 cycle. This means that in order for a packet of data to reach the
     * last LED in the strip, we need to send 1 bit of dummy data for every 2 LEDs. This needs to be done because while
     * there is no data on the SPI bus, the SPI clock will remain idle, and thus the LEDs will not be driven.
     *
     * @param numLedFrames The number of LED frames in a packet.
     * @return The end frame for a packet.
     */
    private static byte[] createEndFrame(int numLedFrames) {
        double numberEndFrameBits = Math.ceil((double) numLedFrames / 2);
        int numberEndFrameBytes = (int) Math.ceil(numberEndFrameBits / 16);
        byte[] endFrame = new byte[numberEndFrameBytes];
        Arrays.fill(endFrame, (byte) 0x00);
        return endFrame;
    }

}
