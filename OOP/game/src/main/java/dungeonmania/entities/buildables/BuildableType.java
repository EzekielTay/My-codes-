package dungeonmania.entities.buildables;

import dungeonmania.Game;

public interface BuildableType {
    public boolean use(Game game, Buildable entity);
}
