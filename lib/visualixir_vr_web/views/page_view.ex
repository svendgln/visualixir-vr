defmodule VisualixirVrWeb.PageView do
  use VisualixirVrWeb, :view

  def hostname do
    node() |> Atom.to_string |> String.split("@") |> List.last
  end
end
