import apa102.APA102;
import apa102.Colour;

import java.util.ArrayList;
import java.util.List;

public class Application {

    /**
     * Here's you starting point. Currently this demonstration creates a list of colours and then
     * writes them to the SPI bus. Why not try extending this driver to add animations to your LED projects.
     */
    public static void main(String[] args) throws Exception {
        List<Colour> colours = new ArrayList<>();
        APA102 ledStrip = new APA102();

        colours.add(Colour.WHITE);
        colours.add(Colour.RED);
        colours.add(Colour.BLUE);
        colours.add(Colour.GREEN);
        colours.add(Colour.MAGENTA);
        colours.add(Colour.CYAN);
        colours.add(Colour.YELLOW);

        ledStrip.writeToStrip(colours);
    }
}
