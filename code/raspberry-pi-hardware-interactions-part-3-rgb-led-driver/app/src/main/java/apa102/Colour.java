package apa102;

/**
 * A Colour class encapsulating brightness, red, green and blue bytes. Each bit in a colour byte is proportional to that
 * colours intensity, that is 0x00 is off, and 0xFF is full intensity. Using combinations of ARGB intensity we can
 * create different colours.
 *
 * Colour values in here match those used in ARGB format in all popular paint programs.
 */
public class Colour {

    public static final byte DEFAULT_BRIGHTNESS = (byte)0x7f;   // 50% brightness

    public final byte brightnessByte;
    public final byte redByte;
    public final byte greenByte;
    public final byte blueByte;

    // Predefined colours
    public static final Colour RED     = new Colour((byte) 0xFF, (byte) 0x00, (byte) 0x00);
    public static final Colour GREEN   = new Colour((byte) 0x00, (byte) 0xFF, (byte) 0x00);
    public static final Colour BLUE    = new Colour((byte) 0x00, (byte) 0x00, (byte) 0xFF);
    public static final Colour CYAN    = new Colour((byte) 0x00, (byte) 0xFF, (byte) 0xFF);
    public static final Colour YELLOW  = new Colour((byte) 0xFF, (byte) 0xFF, (byte) 0x00);
    public static final Colour MAGENTA = new Colour((byte) 0xFF, (byte) 0x00, (byte) 0xFF);
    public static final Colour WHITE   = new Colour((byte) 0xFF, (byte) 0xFF, (byte) 0xFF);
    public static final Colour OFF     = new Colour((byte) 0x00, (byte) 0x00, (byte) 0x00);

    /**
     * Constructs a new colour instance.
     *
     * @param redByte The intensity of red.
     * @param greenByte The intensity of green.
     * @param blueByte The intensity of blue.
     */
    public Colour(byte redByte, byte greenByte, byte blueByte) {
        this.brightnessByte = DEFAULT_BRIGHTNESS;
        this.redByte = redByte;
        this.blueByte = blueByte;
        this.greenByte = greenByte;
    }
}
