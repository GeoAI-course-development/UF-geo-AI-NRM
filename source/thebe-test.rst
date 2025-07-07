Minimal Thebe Test
==================

This page tests the Thebe interactive functionality.

Basic Test
----------

.. thebe-button::

.. code-block:: python
   :class: thebe-code

   print("Hello from Thebe!")

Advanced Test
-------------

.. thebe-button::

.. code-block:: python
   :class: thebe-code

   import numpy as np
   import matplotlib.pyplot as plt
   
   # Create some data
   x = np.linspace(0, 10, 100)
   y = np.sin(x)
   
   # Plot the data
   plt.figure(figsize=(8, 6))
   plt.plot(x, y)
   plt.title('Simple Sine Wave')
   plt.xlabel('x')
   plt.ylabel('sin(x)')
   plt.grid(True)
   plt.show() 