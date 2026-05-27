'use client'

import { useEffect } from "react"
import { gsap } from "gsap"

export function HomeAnimations() {
  useEffect(() => {
    gsap.from(".hero-section", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    })
    gsap.from(".hero-subtitle", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out"
    })
    gsap.from(".search-form", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: "power3.out"
    })
    gsap.from(".browse-more-link", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.9,
      ease: "power3.out"
    })
    gsap.from(".categories-section", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: "power3.out"
    })
    gsap.from(".latest-header", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.5,
      ease: "power3.out"
    })
    gsap.from(".solution-card", {
      y: 40,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      delay: 0.8,
      ease: "power3.out"
    })
  }, [])
  return null
}

export function DetailAnimations() {
  useEffect(() => {
    gsap.from(".back-link", {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: "power3.out"
    })
    gsap.from(".category-tag", {
      y: 20,
      opacity: 0,
      duration: 0.6,
      delay: 0.2,
      ease: "power3.out"
    })
    gsap.from(".solution-title", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      ease: "power3.out"
    })
    gsap.from(".solution-description", {
      y: 20,
      opacity: 0,
      duration: 0.8,
      delay: 0.6,
      ease: "power3.out"
    })
    gsap.from(".projects-section", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.8,
      ease: "power3.out"
    })
    gsap.from(".usage-section", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 1.0,
      ease: "power3.out"
    })
    gsap.from(".source-section", {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 1.2,
      ease: "power3.out"
    })
  }, [])
  return null
}
