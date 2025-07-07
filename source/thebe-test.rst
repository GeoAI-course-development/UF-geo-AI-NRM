Minimal Thebe Test
==================

This page tests the Thebe interactive functionality.

Basic Test
----------

.. code-block:: python
   :class: thebe-code

   print("Hello from Thebe!")

Advanced Test
-------------

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

Test Instructions
----------------

1. Click the "Live Code" button in the top navigation
2. Wait for the environment to load (30-60 seconds)
3. You should see control buttons appear below each code block
4. Try editing the code and clicking "▶️ Run"
5. Use "↩️ Reset" to restore the original code

.. note::
   If you don't see the control buttons, check the browser console for any error messages. 