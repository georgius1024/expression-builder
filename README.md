# Expression builder

The purpose of this small project is to proof-of-concept how a multipurpose real-life expression builder could be built.
Builder contains two major components - domain-specific `RuleBuilder` to build simple expressions like "order amount is over 1000" and domain-agnostic `GroupBuilder` to organize simple expressions into a powerful builder with switchable `and` and `or` logic, with nested groups of rules, etc. Due to the communicative nature of logical operations, the order of expressions is not significant, but drag-and-drop sorting is available.

`RuleBuilder` is domain-specific so for this example it supports inspecting attributes of `Order`, `Customer`, and `Product` entities for an imaginary e-commerce application. In real life, it should reflect domain entities, attributes, etc, and could be potentially more complex.

Please visit then [test site](https://georgius1024.github.io/expression-builder/) to see it working
