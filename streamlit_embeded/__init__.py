import streamlit as st

from pathlib import Path
from streamlit.components.v1.components import declare_component
from streamlit_embeded.version import __release__, __version__

if __release__:
    _source = {"path": (Path(__file__).parent/"frontend"/"build").resolve()}
else:
    _source = {"url": "http://localhost:3001"}

_render_component = declare_component("streamlit_embeded", **_source)


def st_embeded(html, height=None, navbar=True, key=None):
    config = {
        "inline": True,
        "minify_html": True,
        "use_local_assets": True,
        "navbar_show": False,
        "style": {
            "full_width": True
        }
    }

    with st.spinner("Loading embeded..."):
        _render_component(html=html, config=config, height=height, key=key, default=None)
