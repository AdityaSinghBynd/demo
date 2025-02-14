import { useState, useEffect } from 'react';

type GradientColor = [string, string, string];

export const useGradientColors = () => {
  const [selectedColors, setSelectedColors] = useState<GradientColor>(['rgba(135, 206, 235, 0.8)', 'rgba(173, 216, 230, 0.6)', 'rgba(240, 248, 255, 0.4)']);

  const colorSets: GradientColor[] = [
    ['rgba(135, 206, 235, 0.8)', 'rgba(173, 216, 230, 0.6)', 'rgba(240, 248, 255, 0.4)'],
    ['rgba(255, 223, 0, 0.8)', 'rgba(255, 236, 139, 0.6)', 'rgba(255, 250, 205, 0.4)'],
    ['rgba(144, 238, 144, 0.8)', 'rgba(152, 251, 152, 0.6)', 'rgba(240, 255, 240, 0.4)'],
    ['rgba(147, 112, 219, 0.8)', 'rgba(187, 143, 206, 0.6)', 'rgba(225, 190, 231, 0.4)'],
    ['rgba(255, 165, 0, 0.8)', 'rgba(255, 183, 77, 0.6)', 'rgba(255, 224, 178, 0.4)'],
  ];

  const getRandomColorSet = (): GradientColor => {
    const randomIndex = Math.floor(Math.random() * colorSets.length);
    return colorSets[randomIndex];
  };

  useEffect(() => {
    setSelectedColors(getRandomColorSet());
  }, []);

  return selectedColors;
};