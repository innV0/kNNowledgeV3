# Metamodel: Test Metamodel

- id:: test_metamodel
- name:: Test Metamodel for kNN
- version:: 1.0.0
- summary:: A simple metamodel to test various kNN features.

## Item Types

- ### Project
  - instantiable:: true
  - name:: Project
  - type:: category
  - summary:: Represents a project.
  - emoji:: 🚀
  - fields::
    - name:: status
      type:: select
      label:: Project Status
      required:: true
      options:: Idea, In Progress, Completed, On Hold
    - name:: priority
      type:: number
      label:: Priority Level
      required:: false
    - name:: start_date
      type:: date
      label:: Start Date
      required:: false
  - relations::
    - name:: has_task
      targetType:: Task
      cardinality:: one-to-many
      description:: Links a project to its tasks.

- ### Task
  - instantiable:: true
  - name:: Task
  - parentItem:: [[Project]]
  - type:: text
  - summary:: A specific task within a project.
  - emoji:: ✅
  - fields::
    - name:: completed
      type:: boolean
      label:: Is Completed
      required:: true
    - name:: due_date
      type:: date
      label:: Due Date
      required:: false
    - name:: assigned_to
      type:: reference
      label:: Assigned To
      required:: false
  - relations::
    - name:: depends_on
      targetType:: Task
      cardinality:: one-to-many
      description:: Indicates a dependency on another task.

- ### Person
  - instantiable:: true
  - name:: Person
  - type:: text
  - summary:: Represents a person involved in projects or tasks.
  - emoji:: 👤
  - fields::
    - name:: email
      type:: text
      label:: Email Address
      required:: true
    - name:: role
      type:: select
      label:: Role
      required:: false
      options:: Developer, Manager, Tester
