defmodule VisualixirVrWeb.AframeController do
  use VisualixirVrWeb, :controller

  def index(conn, _params) do
    render(conn, "aframe.html")
  end
end
