#include <emscripten.h>
#include <emscripten/em_macros.h>
#include <math.h>

// bisection method
EMSCRIPTEN_KEEPALIVE
double izi_sqrt(double a, double tolerance) {
    if (a == 0.0) return 0.0;
    if (a == 1.0) return 1.0;

    double left = 0.0;
    double right = (a < 1.0) ? 1.0 : a;

    double mid = -1.0;

    while (right - left > tolerance) {
        mid = (left + right) / 2.0;
        double mid_squared = mid * mid;
        if (mid_squared > a) {
            right = mid;
        } else if (mid_squared < a) {
            left = mid;
        } else {
            return mid;
        }
    }

    return mid;
}

// taylor series expansion with error term 
EMSCRIPTEN_KEEPALIVE
void izi_sin(double x, int taylor_iters, double result[2]) {
    x = fmod(x, 2 * M_PI);
    bool negative = false;
    if (x < 0) {
        negative = true;
        x = -x;
    }

    int state = 0; // 0: positive,  1: negative
    double ans = 0.0;
    double cur_term = x;  // x is now guaranteed positive
    double cur_denom = 1;
    double error = -1;

    for (int i = 1; i <= taylor_iters; i+=2) { // INT_MAX
        error = cur_term * x / (cur_denom * (i + 1));
        if (state == 0) {
            ans += cur_term / cur_denom;
        } else if (state == 1) {
            ans -= cur_term / cur_denom;
        }
        state = (state + 1) % 2;
        cur_term *= x * x;
        cur_denom *= (i + 1) * (i + 2);
    }
    
    result[0] = negative ? -ans : ans;
    result[1] = error;
}

// taylor series expansion with error term 
EMSCRIPTEN_KEEPALIVE
void izi_cos(double x, int taylor_iters, double result[2]) {
    x = fmod(x, 2 * M_PI);
    if (x < 0) {
        x = -x;  // cos(-x) = cos(x)
    }

    int state = 0; // 0: positive,  1: negative
    double ans = 0.0;
    double cur_term = 1;
    double cur_denom = 1;
    double error = -1;

    for (int i = 0; i <= taylor_iters; i+=2) { // INT_MAX
        error = cur_term * x / (cur_denom * (i + 1));
        if (state == 0) {
            ans += cur_term / cur_denom;
        } else {
            ans -= cur_term / cur_denom;
        }
        state = (state + 1) % 2;
        cur_term *= x * x;
        cur_denom *= (i + 1) * (i + 2);
    }
    
    result[0] = ans;
    result[1] = error;
}
