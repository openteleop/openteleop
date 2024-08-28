export const chunkArray = <T>(arr: T[], size: number): T[][] => {
  return arr.reduce((acc: any[][], _, index: number) => {
    const groupIndex = Math.floor(index / size);
    if (!acc[groupIndex]) {
      acc[groupIndex] = [];
    }
    acc[groupIndex].push(_);
    return acc;
  }, []);
}

