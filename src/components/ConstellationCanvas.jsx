import React, { useRef, useEffect, useCallback } from 'react';
import { getParticleColors } from '../utils/theme';

const PARTICLE_COUNT = 90;
const CONNECT_DIST = 150;
const MOUSE_RADIUS = 200;
const MOUSE_PUSH = 0.8;

class Particle {
    constructor(w, h) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.bvx = (Math.random() - 0.5) * 0.5;
        this.bvy = (Math.random() - 0.5) * 0.5;
        this.vx = this.bvx;
        this.vy = this.bvy;
        this.r = Math.random() * 2 + 0.5;
        this.bright = Math.random() * 0.5 + 0.3;
    }

    update(mouse, w, h) {
        if (mouse.active) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < MOUSE_RADIUS && dist > 0) {
                const force = ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * MOUSE_PUSH;
                const angle = Math.atan2(dy, dx);
                this.vx += Math.cos(angle) * force;
                this.vy += Math.sin(angle) * force;
                this.bright = Math.min(1, 0.5 + ((MOUSE_RADIUS - dist) / MOUSE_RADIUS) * 0.8);
            } else {
                this.bright += (0.4 - this.bright) * 0.02;
            }
        } else {
            this.bright += (0.4 - this.bright) * 0.02;
        }

        this.vx *= 0.97;
        this.vy *= 0.97;
        this.vx += this.bvx * 0.03;
        this.vy += this.bvy * 0.03;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -20) this.x = w + 20;
        if (this.x > w + 20) this.x = -20;
        if (this.y < -20) this.y = h + 20;
        if (this.y > h + 20) this.y = -20;
    }

    draw(ctx, color) {
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${this.bright * 0.1})`;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${this.bright})`;
        ctx.fill();
    }
}

const ConstellationCanvas = ({ isDark }) => {
    const canvasRef = useRef(null);
    const glowRef = useRef(null);
    const mouseRef = useRef({ x: -500, y: -500, active: false });
    const particlesRef = useRef([]);
    const animRef = useRef(null);
    const sizeRef = useRef({ w: 0, h: 0 });

    // Initialize particles
    useEffect(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        sizeRef.current = { w, h };
        particlesRef.current = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particlesRef.current.push(new Particle(w, h));
        }
    }, []);

    // Resize handler
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            sizeRef.current = { w, h };
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
            if (glowRef.current) {
                glowRef.current.style.left = e.clientX + 'px';
                glowRef.current.style.top = e.clientY + 'px';
                glowRef.current.style.opacity = '1';
            }
        };
        const handleMouseLeave = () => {
            mouseRef.current.active = false;
            if (glowRef.current) {
                glowRef.current.style.opacity = '0';
            }
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    // Animation loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const animate = () => {
            const { w, h } = sizeRef.current;
            const mouse = mouseRef.current;
            const particles = particlesRef.current;
            const colors = getParticleColors(isDark);

            ctx.clearRect(0, 0, w, h);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update(mouse, w, h);
                particles[i].draw(ctx, colors);

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CONNECT_DIST) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${colors.r},${colors.g},${colors.b},${0.12 * (1 - dist / CONNECT_DIST)})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }

            // Mouse-to-particle lines
            if (mouse.active) {
                for (let i = 0; i < particles.length; i++) {
                    const dx = particles[i].x - mouse.x;
                    const dy = particles[i].y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < MOUSE_RADIUS * 1.2) {
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(particles[i].x, particles[i].y);
                        ctx.strokeStyle = `rgba(${colors.nr},${colors.ng},${colors.nb},${0.2 * (1 - dist / (MOUSE_RADIUS * 1.2))})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            animRef.current = requestAnimationFrame(animate);
        };

        animRef.current = requestAnimationFrame(animate);
        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [isDark]);

    const glowBg = isDark
        ? 'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)'
        : 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)';

    return (
        <>
            <canvas
                ref={canvasRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                }}
            />
            {/* Subtle grid overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    zIndex: 0,
                    pointerEvents: 'none',
                    backgroundImage: `linear-gradient(${isDark ? 'rgba(59,130,246,0.02)' : 'rgba(217,119,6,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(59,130,246,0.02)' : 'rgba(217,119,6,0.03)'} 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    transition: 'background-image 0.5s',
                }}
            />
            {/* Mouse glow follower */}
            <div
                ref={glowRef}
                style={{
                    position: 'fixed',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: glowBg,
                    pointerEvents: 'none',
                    zIndex: 0,
                    transform: 'translate(-50%, -50%)',
                    transition: 'opacity 0.3s, background 0.5s',
                    opacity: 0,
                }}
            />
        </>
    );
};

export default ConstellationCanvas;
