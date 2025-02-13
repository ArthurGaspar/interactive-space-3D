from math import pi

G = 6.67430e-11

def calculate_gravity(m1, m2, r):
    """Calculate the gravitational force between two masses."""
    return (G * m1 * m2) / (r ** 2)

m_earth = 5.972e24
m_moon = 7.34767309e22
r = 384400000

force = calculate_gravity(m_earth, m_moon, r)
print(f"Gravitational Force between Earth and Moon: {force} N")