import React, { useEffect } from 'react';
import p5 from 'p5';

class SmokeParticle {
  constructor(p, x, y) {
    this.x = x;
    this.y = y;
    this.size = p.random(5, 10);        // Start small
    this.initialSize = this.size;
    this.maxSize = p.random(30, 60);    // Max size while fading
    this.opacity = 255;
    this.speed = p.random(0.3, 1.2);
    this.growthRate = p.random(0.2, 0.5); // Size increase per frame
  }

  update() {
    this.y -= this.speed;
    this.opacity -= 2;

    // Gradually grow in size but don’t exceed max
    if (this.size < this.maxSize) {
      this.size += this.growthRate;
    }
  }

  display(p) {
    p.noStroke();
    p.fill(255, 255, 255, this.opacity);
    p.ellipse(this.x, this.y, this.size);
  }

  isAlive() {
    return this.opacity > 0;
  }
}


const BottomSmoke = () => {
  useEffect(() => {
    const sketch = (p) => {
      let smokeParticles = [];

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight / 4); // Adjust canvas height for the bottom part
        p.clear(); // Transparent background
      };

      p.draw = () => {
        p.clear(); // Ensures no colored background overlays the site
        if (p.frameCount % 2 === 0) {
          smokeParticles.push(new SmokeParticle(p, p.random(p.width), p.height));
        }

        for (let i = smokeParticles.length - 1; i >= 0; i--) {
          let particle = smokeParticles[i];
          particle.update();
          particle.display(p);

          if (!particle.isAlive()) {
            smokeParticles.splice(i, 1);
          }
        }
      };

      p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight / 4); // Keep canvas size fixed at the bottom
      };
    };

    const p5Instance = new p5(sketch);
    const canvas = p5Instance.canvas;

    // Ensure canvas is available before applying styles
    if (canvas) {
      canvas.style.position = 'fixed'; // Make it fixed at the bottom
      canvas.style.bottom = '0';        // Align it at the bottom
      canvas.style.left = '0';          // Align it to the left edge
      canvas.style.zIndex = '-1';       // Ensure it's behind all other elements
      canvas.style.pointerEvents = 'none'; // Ensure it doesn't block interactions
    }

    return () => {
      p5Instance.remove();
    };
  }, []);

  return null;
};

export default BottomSmoke;
