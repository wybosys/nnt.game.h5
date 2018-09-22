module nn {

    class ExtParticle extends particle.GravityParticleSystem {

    }

    export class Particle extends CParticle {
        constructor() {
            super();
        }

        private _pc: ExtParticle;

        protected set pc(pc: ExtParticle) {
            if (this._pc == pc)
                return;
            if (this._pc) {
                this._pc.stop();
                this._imp.removeChild(this._pc);
                this._pc = null;
            }
            if (pc) {
                this._pc = pc;
                this._imp.addChild(pc);
                if (this.autoPlay)
                    this.start();
                this.setNeedsLayout();
            }

            if (this._signals) {
                this._signals.emit(SignalUpdated);
                this._signals.emit(SignalChanged);
            }
        }

        updateLayout() {
            super.updateLayout();
            if (this._pc) {
                let rc = this.bounds();
                this.impSetFrame(rc.integral(), this._pc);
            }
        }

        start() {
            if (this._pc) {
                this._pc.start();
                this.__playing = true;
            }
        }

        stop() {
            if (this._pc) {
                this._pc.stop(true);
            }
            this.__playing = false;
        }

        private __playing: boolean;

        isPlaying(): boolean {
            return this.__playing;
        }

        private _ps: ParticleSource;

        set particleSource(ps: ParticleSource) {
            let self = this;
            if (ObjectT.IsEqual(ps, self._ps)) {
                if (self._signals)
                    self._signals.emit(SignalUpdated);
                return;
            }

            if (ps == null && self._ps) {
                self.pc = null;
                self._ps = null;
                return;
            }

            let pps = self._ps;
            self._ps = ps;

            // 加载资源
            ResManager.getSources([
                [ps.config, ResType.JSON],
                [ps.texture, ResType.TEXTURE]
            ], ResPriority.CLIP, (ds: ICacheRecord[]) => {
                if (self.__disposed || !ObjectT.IsEqual(ps, self._ps))
                    return;

                // todo 适时释放
                let djson = ds[0].use();
                let dtex = ds[1].use();

                if (djson == null) {
                    warn("particle-cfg " + ps.config + " not found");
                    return;
                }
                if (dtex == null) {
                    warn("particle-tex " + ps.texture + " not found");
                    return;
                }

                let pc = new ExtParticle(dtex, djson);
                this.pc = pc;
            }, this);
        }
    }
}
