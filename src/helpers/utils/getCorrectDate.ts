export const getCorrectDateDDMMYYYY = (dateString: string) => {
    const [d, m, y] = dateString.split(/\D/).map(el => Number(el));
    return new Date(y, m-1, d);
};