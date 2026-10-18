from langsmith import Client

client = Client()

agent_prompt = client.pull_prompt(
    "hwchase17/react", dangerously_pull_public_prompt=True
)
agent_prompt = agent_prompt.template
# While Invoking the Agent, Pass an input dict: invoke({"input": ...})
