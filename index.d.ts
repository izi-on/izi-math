/**
 * Initialize the WebAssembly module. Must be called (and awaited)
 * before using any math functions.
 */
export declare function init(): Promise<void>;

/** Square root (returns NaN if a < 0) 
 * 
 * @param a - The number to calculate the square root of
 * @param tolerance - The error tolerance for the calculation. Minimum tolerance is 0.00000001 (1e-8)
 * @returns The square root of the number
*/
export declare function sqrt(a: number, tolerance?: number): number;

/** Sine function (returns NaN if x is not a number) 
 * 
 * @param x - The angle in radians
 * @param taylor_iters - The number of Taylor series iterations to use
 * @returns The sine of the angle and the upper bound of the error of the calculation
*/
export declare function sin(x: number, taylor_iters?: number): { ans: number, error: number };

/** Cosine function (returns NaN if x is not a number) 
 * 
 * @param x - The angle in radians
 * @param taylor_iters - The number of Taylor series iterations to use
 * @returns The cosine of the angle and the upper bound of the error of the calculation
*/
export declare function cos(x: number, taylor_iters?: number): { ans: number, error: number };