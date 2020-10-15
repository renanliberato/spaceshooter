import { GameObject } from "../gameobject";
import { ShipDamageAnimationBehaviour } from "./shipDamageAnimationBehaviour";
import { ImageRendererBehaviour } from "./imageRendererBehaviour";

export class ShipBehaviour extends GameObject {
    constructor(gameobject, game, image, dmgimage1, dmgimage2, dmgimage3) {
        super(game);
        this.gameobject = gameobject;
        this.gameobject.shipBehaviour = this;

        this.addComponent(new ImageRendererBehaviour(this.gameobject, this.game, image, 0.5));
        const dmgAnimationBehaviour = new ShipDamageAnimationBehaviour(this.gameobject, this.game, dmgimage1, dmgimage2, dmgimage3);
        this.addComponent(dmgAnimationBehaviour);

        this.disposables.push(
            this.gameobject.emitter.on("TookDamage", ({id, amount, health}) => {
                if (this.gameobject.id == id) {
                    dmgAnimationBehaviour.startDamageAnimation();
                }
            })
        );
    }
}