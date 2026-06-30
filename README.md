# Testing Showcase

[![Test Suite](https://github.com/Euchelu/testing-showcase/actions/workflows/test-all.yml/badge.svg)](https://github.com/Euchelu/testing-showcase/actions/workflows/test-all.yml)
![Java](https://img.shields.io/badge/java-21-orange)
![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow)
![JUnit](https://img.shields.io/badge/JUnit-5-green)
![Jest](https://img.shields.io/badge/Jest-29-red)

Multi-language testing showcase demonstrating best practices with **JUnit 5** (Java) and **Jest** (JavaScript). Both test suites run in parallel on every push via GitHub Actions.

## Structure

```
testing-showcase/
├── java/
│   ├── pom.xml
│   └── src/
│       ├── main/java/com/euchelu/bank/
│       │   └── BankAccount.java          # Domain class
│       └── test/java/com/euchelu/bank/
│           └── BankAccountTest.java      # 18 JUnit 5 tests
├── javascript/
│   ├── src/
│   │   └── validator.js                  # Form validation utilities
│   └── tests/
│       └── validator.test.js             # 34 Jest tests
└── .github/workflows/
    └── test-all.yml                      # Parallel CI for both suites
```

## Test Coverage

| Language | Framework | Tests | Coverage |
|----------|-----------|-------|----------|
| Java | JUnit 5 | 18 | — |
| JavaScript | Jest | 34 | 97% |
| **Total** | | **52** | |

## Java — JUnit 5

A `BankAccount` class demonstrating:
- `@BeforeEach` setup fixtures
- `@ParameterizedTest` with `@ValueSource`
- `assertThrows` for exception testing
- `@DisplayName` for readable test names
- Atomicity testing (partial state verification)

**Run locally** (requires Maven):
```bash
cd java
mvn test
```

## JavaScript — Jest

Form validation utilities demonstrating:
- `test.each` for parametrized tests
- Spread operator for form mutation tests (`{ ...validForm, email: 'bad' }`)
- Coverage reporting with `--coverage`
- Testing `null`/`undefined` edge cases

**Run locally** (requires Node.js):
```bash
cd javascript
npm install
npm test
```

Output:
```
  validateEmail        ✓ 11 tests
  validatePassword     ✓ 9 tests
  validatePhone        ✓ 10 tests
  validateRegistrationForm ✓ 4 tests

Tests: 34 passed — Coverage: 97.43%
```

## CI Pipeline

Both jobs run **in parallel** on every push:

```yaml
jobs:
  java-tests:   # Sets up Java 21, runs mvn test
  js-tests:     # Sets up Node 20, runs npm test
```

JUnit test reports are uploaded as GitHub Actions artifacts after each run.

## Author

**José Ángel Ceballos Rodríguez**
- GitHub: [@Euchelu](https://github.com/Euchelu)
- LinkedIn: [José Ángel Ceballos](https://www.linkedin.com/in/josé-ángel-ceballos-rodríguez-a44996346/)
