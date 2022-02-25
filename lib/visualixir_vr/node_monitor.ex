defmodule VisualixirVr.NodeMonitor do
  use GenServer
  require Logger
  alias VisualixirVrWeb.TraceChannel

  def start_link do
    GenServer.start_link(__MODULE__, [])
  end

  def init([]) do
    :ok = :net_kernel.monitor_nodes(true)
    {:ok, nil}
  end

  def handle_info({:nodeup, node}, state) do
    Logger.info "[Visualixir] Connection to #{node} established."
    VisualixirVrWeb.NodesChannel.refresh()
    {:noreply, state}
  end

  def handle_info({:nodedown, node}, state) do
    Logger.warn "[Visualixir] Lost connection to #{node}..."
    TraceChannel.announce_cleanup(node)
    VisualixirVrWeb.NodesChannel.refresh()
    {:noreply, state}
  end
end
