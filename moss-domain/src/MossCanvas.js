import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const MossCanvas = () => {
  const containerRef = useRef(null);
  const p5InstanceRef = useRef(null);

  useEffect(() => {
    let mossStrands = [];
    let animationComplete = false;

    const sketch = (p) => {
      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight / 8).parent(containerRef.current);
        p.background(20);
        p.noFill();

        mossStrands = [];
        for (let x = 0; x < p.width; x += 2) {
          mossStrands.push({
            x: x,
            y: 0,
            length: p.random(80, 100),
            growthRate: p.random(0.1, 0.3),
            offset: p.random(p.TWO_PI),
            path: [],
            done: false,
          });
        }

        p.frameRate(60);
      };

      p.draw = () => {
        if (animationComplete) return;

        p.noStroke();
        p.fill(20, 50);
        p.rect(0, 0, p.width, p.height);

        p.strokeWeight(1.5);
        let allDone = true;

        for (let strand of mossStrands) {
          if (!strand.done && strand.y < strand.length) {
            allDone = false;

            const sway = p.sin(strand.offset + strand.y * 0.09) * p.random(-1.5, 1.5);
            const jitter = p.random(-0.2, 0.2);
            const newX = strand.x + sway + jitter;
            const newY = strand.y;

            strand.path.push({ x: newX, y: newY });
            strand.y += strand.growthRate;

            for (let i = 0; i < 2; i++) {
              const angle = p.random(p.TWO_PI);
              const r = p.random(1, 2);
              p.stroke(34, p.random(100, 200), 34, 100);
              p.point(newX + p.cos(angle) * r, newY + p.sin(angle) * r);
            }
          } else {
            strand.done = true;
          }

          p.noFill();
          p.stroke(34, 139, 34, 150);
          p.beginShape();
          for (let pt of strand.path) {
            p.vertex(pt.x, pt.y);
          }
          p.endShape();
        }

        if (allDone) {
          animationComplete = true;
          console.log('Moss growth complete.');
        }
      };
    };

    p5InstanceRef.current = new p5(sketch);

    return () => {
      p5InstanceRef.current.remove();
    };
  }, []);

  return <div ref={containerRef} />;
};

export default MossCanvas;
