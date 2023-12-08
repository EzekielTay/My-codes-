package dungeonmania.entities.playerState;

public interface StateInterface {
    public abstract void transitionInvisible();

    public abstract void transitionInvincible();

    public abstract void transitionBase();
}
