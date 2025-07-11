import aws_cdk as core
import aws_cdk.assertions as assertions

from eks_basic.eks_basic_stack import EksBasicStack

# example tests. To run these tests, uncomment this file along with the example
# resource in eks_basic/eks_basic_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = EksBasicStack(app, "eks-basic")
    template = assertions.Template.from_stack(stack)
