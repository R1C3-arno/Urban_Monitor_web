import { useState, useEffect, useCallback } from 'react';

/**
 * useAlgorithmAnimation Hook
 * Controls step-by-step algorithm animation
 */
export const useAlgorithmAnimation = (explorationSteps = []) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speed, setSpeed] = useState(1);
    const [subscribers, setSubscribers] = useState([]);

    const subscribe = useCallback((callback) => {
        setSubscribers(prev => [...prev, callback]);
        return () => {
            setSubscribers(prev => prev.filter(cb => cb !== callback));
        };
    }, []);

    const notifySubscribers = useCallback((step) => {
        subscribers.forEach(cb => cb(step));
    }, [subscribers]);

    useEffect(() => {
        if (!isPlaying || currentStep >= explorationSteps.length) {
            return;
        }

        const step = explorationSteps[currentStep];
        notifySubscribers(step);

        const baseDelay = 80;
        const delay = baseDelay / speed;

        const timer = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, delay);

        return () => clearTimeout(timer);
    }, [currentStep, explorationSteps, isPlaying, speed, notifySubscribers]);

    const pause = useCallback(() => setIsPlaying(false), []);
    const play = useCallback(() => setIsPlaying(true), []);
    const reset = useCallback(() => {
        setCurrentStep(0);
        setIsPlaying(true);
    }, []);

    return {
        currentStep,
        isPlaying,
        speed,
        totalSteps: explorationSteps.length,
        progress: explorationSteps.length > 0
            ? (currentStep / explorationSteps.length) * 100
            : 0,
        subscribe,
        pause,
        play,
        reset,
        setSpeed: useCallback((newSpeed) => setSpeed(newSpeed), [])
    };
};