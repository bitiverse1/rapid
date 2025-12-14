#!/bin/bash

# React Frontend Helper Functions for Rapid Script

setup_react_frontend() {
    local app_dir=$1
    local workspace_root=$2
    
    print_step "Setting up React Router and folder structure..."
    cd "${app_dir}/frontend"
    
    # Install React Router
    npm install react-router-dom
    
    # Create folder structure
    mkdir -p src/components src/context src/pages
    
    echo ""
    ask_question "Which CSS framework would you like to use with React?"
    echo -e "  ${CYAN}1)${NC} None (plain CSS)"
    echo -e "  ${CYAN}2)${NC} Material-UI (MUI) ${YELLOW}[default]${NC}"
    echo -e "  ${CYAN}3)${NC} Tailwind CSS"
    echo -e "  ${CYAN}4)${NC} AWS Cloudscape"
    echo ""
    read -p "$(echo -e "${ARROW} Enter your choice [1-4, default=2]: ")" css_choice
    css_choice=${css_choice:-2}
    
    case $css_choice in
        2)
            setup_mui "${app_dir}" "${workspace_root}"
            ;;
        3)
            setup_tailwind "${app_dir}" "${workspace_root}"
            ;;
        4)
            setup_cloudscape "${app_dir}" "${workspace_root}"
            ;;
        *)
            setup_basic_react "${app_dir}" "${workspace_root}"
            ;;
    esac
    
    print_success "React setup complete with routing and folder structure"
}

setup_mui() {
    local app_dir=$1
    local workspace_root=$2
    local template_dir="${workspace_root}/scripts/rapid/templates/react/mui"
    
    print_step "Installing Material-UI..."
    npm install @mui/material @emotion/react @emotion/styled
    
    # Copy template files
    cp "${template_dir}/index.css" src/index.css
    cp "${template_dir}/App.tsx" src/App.tsx
    cp "${template_dir}/Home.tsx" src/pages/Home.tsx
    cp "${template_dir}/About.tsx" src/pages/About.tsx
    cp "${template_dir}/Dashboard.tsx" src/pages/Dashboard.tsx
    
    print_success "Material-UI installed and configured with example pages"
}

setup_tailwind() {
    local app_dir=$1
    local workspace_root=$2
    local template_dir="${workspace_root}/scripts/rapid/templates/react/tailwind"
    
    print_step "Installing Tailwind CSS..."
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    
    # Configure Tailwind
    cat > tailwind.config.js <<'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF
    
    # Add Tailwind directives to CSS
    cat > src/index.css <<'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}
EOF

    # Copy Tailwind template files
    cp "${template_dir}/App.tsx" src/App.tsx
    cp "${template_dir}/Home.tsx" src/pages/Home.tsx
    cp "${template_dir}/About.tsx" src/pages/About.tsx
    cp "${template_dir}/Dashboard.tsx" src/pages/Dashboard.tsx
    
    print_success "Tailwind CSS installed and configured with example pages"
}

setup_cloudscape() {
    local app_dir=$1
    local workspace_root=$2
    local template_dir="${workspace_root}/scripts/rapid/templates/react/cloudscape"
    
    print_step "Installing AWS Cloudscape..."
    npm install @cloudscape-design/components @cloudscape-design/global-styles
    
    # Create Cloudscape templates inline (since they're complex)
    cat > src/App.tsx <<'EOF'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AppLayout, TopNavigation, SpaceBetween } from '@cloudscape-design/components';
import '@cloudscape-design/global-styles/index.css';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';

function Navigation() {
  const navigate = useNavigate();
  
  return (
    <TopNavigation
      identity={{
        href: '/',
        title: 'My App',
        onFollow: (e) => {
          e.preventDefault();
          navigate('/');
        },
      }}
      utilities={[
        {
          type: 'button',
          text: 'Home',
          onClick: () => navigate('/'),
        },
        {
          type: 'button',
          text: 'About',
          onClick: () => navigate('/about'),
        },
        {
          type: 'button',
          text: 'Dashboard',
          onClick: () => navigate('/dashboard'),
        },
      ]}
    />
  );
}

function AppContent() {
  return (
    <>
      <Navigation />
      <AppLayout
        navigationHide
        toolsHide
        content={
          <SpaceBetween size="l">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </SpaceBetween>
        }
      />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
EOF

    cat > src/pages/Home.tsx <<'EOF'
import { Container, Header, SpaceBetween, Button, Box } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  
  return (
    <Container
      header={
        <Header variant="h1">
          Welcome to Your App
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box variant="p">
          Built with React, AWS Cloudscape Design System, and React Router
        </Box>
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="primary" onClick={() => navigate('/about')}>
            About
          </Button>
          <Button onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
}
EOF

    cat > src/pages/About.tsx <<'EOF'
import { Container, Header, SpaceBetween, Button, Box } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  
  return (
    <Container
      header={
        <Header variant="h1">
          About
        </Header>
      }
    >
      <SpaceBetween size="l">
        <Box variant="p">
          This is a sample application built with React, AWS Cloudscape Design System, and React Router.
        </Box>
        <Box variant="p">
          Cloudscape is an open-source design system for building intuitive, engaging, and inclusive user experiences at scale.
        </Box>
        <Button onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </SpaceBetween>
    </Container>
  );
}
EOF

    cat > src/pages/Dashboard.tsx <<'EOF'
import { Container, Header, SpaceBetween, Button, Cards, Box } from '@cloudscape-design/components';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const items = [
    { name: 'Card 1', description: 'This is a sample card component' },
    { name: 'Card 2', description: 'Another sample card component' },
    { name: 'Card 3', description: 'Yet another sample card' },
  ];
  
  return (
    <SpaceBetween size="l">
      <Header variant="h1">Dashboard</Header>
      <Cards
        cardDefinition={{
          header: item => item.name,
          sections: [
            {
              id: 'description',
              content: item => item.description,
            },
          ],
        }}
        items={items}
        cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 3 }]}
      />
      <Button onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </SpaceBetween>
  );
}
EOF
    
    print_success "AWS Cloudscape installed and configured with example pages"
}

setup_basic_react() {
    local app_dir=$1
    local workspace_root=$2
    local template_dir="${workspace_root}/scripts/rapid/templates/react/basic"
    
    print_info "Skipping CSS framework installation"
    
    # Copy basic template files
    cp "${template_dir}/App.tsx" src/App.tsx
    cp "${template_dir}/Home.tsx" src/pages/Home.tsx
    cp "${template_dir}/About.tsx" src/pages/About.tsx
    cp "${template_dir}/Dashboard.tsx" src/pages/Dashboard.tsx
    
    print_success "React Router configured with basic example pages"
}
