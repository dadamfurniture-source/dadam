#!/bin/bash

echo ""
echo "============================================================"
echo "           Dadam AI Agent - Starting..."
echo "============================================================"
echo ""
echo "  Main App: http://localhost:8000"
echo ""
echo "  Press Ctrl+C to stop the server."
echo "============================================================"
echo ""

cd backend

# Check if virtual environment exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Start server
python main.py
