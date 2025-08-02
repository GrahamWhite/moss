'use client';
import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

export default function Smoke() {
  const sketchRef = useRef();

  useEffect(() => {
    const sketch = (p) => {
      let smokePuffs = [];

      p.setup = () => {
        p.createCanvas(400, 400);
        p.noStroke();
        p.clear(); // for transparent background
        for (let i = 0; i < 50; i++) {
          smokePuffs.push(new SmokePuff(p, 200, 300)); // more puffs, centered source
        }
      };

      p.draw = () => {
        p.clear(); // maintain transparency
        for (let puff of smokePuffs) {
          puff.update();
          puff.draw();
        }
      };

      class SmokePuff {
        constructor(p, x, y) {
          this.p = p;
          this.origin = p.createVector(x + p.random(-4, 4), y + p.random(-4, 4));
          this.pos = this.origin.copy();
          this.size = p.random(20, 40); // larger puffs
          this.speed = p.createVector(p.random(-0.3, 0.3), p.random(-0.4, -1));
          this.alpha = 200 + p.random(50);
        }

        update() {
          this.pos.add(this.speed);
          this.alpha -= 0.5;
          if (this.alpha <= 0) {
            this.pos = this.origin.copy();
            this.alpha = 255;
          }
        }

        draw() {
          this.p.fill(200, this.alpha);
          this.p.ellipse(this.pos.x, this.pos.y, this.size);
        }
      }
    };

    const p5Instance = new p5(sketch, sketchRef.current);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div
      ref={sketchRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    />
  );
}
