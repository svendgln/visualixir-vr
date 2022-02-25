defmodule VisualixirVrWeb.NodesChannel do
  use VisualixirVrWeb, :channel
  require Logger
  alias VisualixirVrWeb.Endpoint
  alias VisualixirVrWeb.TraceChannel
  alias VisualixirVr.Tracer

  # @channel "nodes:*"
  @channel "nodes"

  @impl true
  def join(@channel, _payload, socket) do
    # nodes msg: %{nodes: list of known nodes} (must be map)
    {:ok, nodes_msg(), socket}
  end

  def refresh do
    Endpoint.broadcast!(@channel, "update", nodes_msg())
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  # @impl true #not used in visualixir
  # def handle_in("ping", payload, socket) do
  #   {:reply, {:ok, payload}, socket}
  # end

  # # It is also common to receive messages from the client and
  # # broadcast to everyone in the current topic (nodes:lobby).
  # @impl true #not used in visualixir
  # def handle_in("shout", payload, socket) do
  #   broadcast(socket, "shout", payload)
  #   {:noreply, socket}
  # end

  # -> node_selector.js
  @impl true
  def handle_in("add", {:binary, node}, socket) do
    ping_result = node |> String.to_atom |> Node.ping # ping :nodeName, response= :pong | :pang
    Logger.debug("[Visualixir] Pinging node #{node} returned #{inspect ping_result}")
    refresh()
    {:noreply, socket}
  end
  @impl true
  def handle_in("visualize", node, socket) do
    node = String.to_atom(node)

    Tracer.start(node)

    TraceChannel.announce_visualize(node)

    {:noreply, socket}
  end
  @impl true
  def handle_in("cleanup", node, socket) do
    node = String.to_atom(node)

    Logger.debug("[Visualixir] Telling node #{node} to clean up")

    Tracer.stop(node)

    TraceChannel.announce_cleanup(node)

    {:noreply, socket}
  end

  defp nodes_msg do
    %{nodes: Node.list(:known)}
  end

end
