"""Calculate pi using the Chudnovsky algorithm."""

from decimal import Decimal, getcontext


def calculate_pi(digits: int = 50) -> Decimal:
    getcontext().prec = digits + 10

    # Chudnovsky series: converges ~14 digits per term
    c = 426880 * Decimal(10005).sqrt()
    m, l, x, k, s = Decimal(1), Decimal(13591409), Decimal(1), 6, Decimal(13591409)

    for i in range(1, digits // 14 + 2):
        m = m * (k**3 - 16 * k) / Decimal(i) ** 3
        l += 545140134
        x *= -262537412640768000
        s += m * l / x
        k += 12

    pi = c / s
    getcontext().prec = digits + 1
    return +pi  # unary plus applies the new precision


if __name__ == "__main__":
    print(calculate_pi(50))
