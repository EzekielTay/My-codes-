package dungeonmania.entities.buildables;

import dungeonmania.Game;

public class Indestructible implements BuildableType {

    @Override
    public boolean use(Game game, Buildable entity) {
        return true;
    }

}
