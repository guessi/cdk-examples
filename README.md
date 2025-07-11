# AWS CDK Examples

A collection of AWS CDK examples demonstrating various AWS services and infrastructure patterns.

## Prerequisites

- AWS CLI with AWS Profile configured
- Node.js 22+ (for TypeScript examples)
- Python 3.12+ (for Python examples)

## Usage

Navigate to any example directory and follow the standard CDK workflow:

```bash
# For Python examples
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# For TypeScript examples
npm install

# Deploy any example
npx cdk deploy
```

## Cleanup

```bash
npx cdk destroy
```
