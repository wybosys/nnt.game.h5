module nn {

    class _ParticlesManager {

        instanceParticle(name:string):particle.ParticleSystem {
            var tex = RES.getRes(name + "_png");
            if (tex == null) {
                nn.warn("particle " + name + "_png not found");
                return null;
            }

            var cfg = RES.getRes(name + "_json");
            if (cfg == null) {
                nn.warn("particle " + name + "_json not found");
                return null;
            }

            var r = new particle.GravityParticleSystem(tex, cfg);
            if (r == null) {
                nn.warn("particle " + name + " instance failed");
            }

            return r;
        }
        
    }

    export var ParticlesManager = new _ParticlesManager();

    export class Particle
    extends Widget
    {
        constructor() {
            super();
        }

        dispose() {
            super.dispose();
            this.stopAnimation();
        }

        _name:string;
        get name():string {
            return this._name;
        }
        set name(val:string) {
            if (this._name == val)
                return;
            this._name = val;
            this.system = ParticlesManager.instanceParticle(this._name);
        }

        _system:particle.ParticleSystem;
        get system():particle.ParticleSystem {
            return this._system;
        }
        set system(val:particle.ParticleSystem) {
            if (this._system == val)
                return;
            if (this._system) {
                this.stopAnimation();
                this._imp.removeChild(this._system);
            }
            this._system = val;
            if (this._system) {                
                this._imp.addChild(this._system);
                this.startAnimation();
            }
            this.updateLayout();
        }

        updateLayout() {
            super.updateLayout();
            if (this._system) {
                var rc = this.bounds();
                
                rc.x = rc.width*0.5 - this._system.emitterX;
                rc.y = rc.height*0.5 - this._system.emitterY;

                this.impSetFrame(rc, this._system);
            }
        }

        startAnimation() {
            this._system && this._system.start();
        }

        stopAnimation() {
            this._system && this._system.stop();
        }        
    }

}
