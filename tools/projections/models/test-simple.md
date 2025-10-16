# Test Simple Model

This is a very simple test model to verify data import functionality.

# Projections

- tags:: [[test]], [[simple]]
- selectedMetricId:: test_metric_1
- viewMode:: monthly
- chartMetrics:: ["test_metric_1"]

## Business Metrics (Metrics Array)

* [[Test Revenue]]

  - id:: test_metric_1
  - slug:: test_revenue
  - description:: Simple test revenue metric
  - type:: variable
  - unit:: $
  - color:: #28a745
  - interpolation:: linear
  - tags:: [[revenue]], [[test]]
  - values::
    - 1-1:: 1000
    - 1-2:: 1100
    - 1-3:: 1200
    - 1-4:: 1300
    - 1-5:: 1400
    - 1-6:: 1500
  - format::
    - decimals:: 0
    - compact:: false
    - currency:: $
    - percentage:: false
    - scientific:: false
    - suffix::
    - rounding:: round
    - colorize:: false
    - minThreshold:: 0.01

* [[Test Costs]]

  - id:: test_metric_2
  - slug:: test_costs
  - description:: Simple test costs metric
  - type:: variable
  - unit:: $
  - color:: #dc3545
  - interpolation:: linear
  - tags:: [[costs]], [[test]]
  - values::
    - 1-1:: 500
    - 1-2:: 550
    - 1-3:: 600
    - 1-4:: 650
    - 1-5:: 700
    - 1-6:: 750
  - format::
    - decimals:: 0
    - compact:: false
    - currency:: $
    - percentage:: false
    - scientific:: false
    - suffix::
    - rounding:: round
    - colorize:: false
    - minThreshold:: 0.01

* [[Test Profit]]

  - id:: test_metric_3
  - slug:: test_profit
  - description:: Calculated profit metric
  - type:: calculated
  - unit:: $
  - color:: #007bff
  - interpolation:: linear
  - tags:: [[profit]], [[calculated]], [[test]]
  - formula:: test_revenue - test_costs
  - format::
    - decimals:: 0
    - compact:: false
    - currency:: $
    - percentage:: false
    - scientific:: false
    - suffix::
    - rounding:: round
    - colorize:: true
    - minThreshold:: 0.01