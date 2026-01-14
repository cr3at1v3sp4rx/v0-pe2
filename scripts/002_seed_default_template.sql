-- Seed default templates for new users
-- Run this script after creating the schema to populate sample templates

-- Insert sample template for a user (replace with actual user_id after testing)
-- Example template for Professional Proposal
INSERT INTO public.templates (
  user_id,
  name,
  description,
  sections,
  design_settings
) VALUES (
  auth.uid(), -- Uses current authenticated user
  'Professional Proposal',
  'Clean and modern business proposal template',
  jsonb_build_array(
    jsonb_build_object(
      'id', '1',
      'type', 'cover',
      'title', 'Cover Page',
      'content', jsonb_build_object(
        'companyName', 'Your Company',
        'clientName', 'Client Name',
        'projectTitle', 'Project Title',
        'subtitle', 'Proposal Overview'
      )
    ),
    jsonb_build_object(
      'id', '2',
      'type', 'overview',
      'title', 'Project Overview',
      'content', jsonb_build_object(
        'text', 'This proposal outlines a comprehensive project designed to deliver exceptional results and drive business growth through strategic execution.'
      )
    ),
    jsonb_build_object(
      'id', '3',
      'type', 'services',
      'title', 'Our Services',
      'content', jsonb_build_object(
        'items', jsonb_build_array('Service 1', 'Service 2', 'Service 3', 'Service 4')
      )
    ),
    jsonb_build_object(
      'id', '4',
      'type', 'pricing',
      'title', 'Investment',
      'content', jsonb_build_object(
        'packages', jsonb_build_array(
          jsonb_build_object(
            'name', 'Starter',
            'price', '$5,000',
            'description', 'Perfect for small projects with focused scope'
          ),
          jsonb_build_object(
            'name', 'Professional',
            'price', '$15,000',
            'description', 'Our most popular package for growing businesses'
          ),
          jsonb_build_object(
            'name', 'Enterprise',
            'price', 'Custom',
            'description', 'Tailored solutions for large-scale initiatives'
          )
        )
      )
    ),
    jsonb_build_object(
      'id', '5',
      'type', 'custom',
      'title', 'Next Steps',
      'content', jsonb_build_object(
        'text', 'We''re excited to work with you on this project. Let''s discuss next steps and answer any questions you may have.'
      )
    )
  ),
  jsonb_build_object(
    'accentColor', '#1e40af',
    'coverStyle', 'gradient',
    'typography', 'modern'
  )
) ON CONFLICT DO NOTHING;

-- Template for Tech Startup Pitch
INSERT INTO public.templates (
  user_id,
  name,
  description,
  sections,
  design_settings
) VALUES (
  auth.uid(),
  'Tech Startup Pitch',
  'Investment pitch template for technology startups',
  jsonb_build_array(
    jsonb_build_object(
      'id', '1',
      'type', 'cover',
      'title', 'Cover Page',
      'content', jsonb_build_object(
        'companyName', 'Your Startup',
        'clientName', 'Investor',
        'projectTitle', 'Investment Pitch',
        'subtitle', 'Revolutionizing the industry'
      )
    ),
    jsonb_build_object(
      'id', '2',
      'type', 'overview',
      'title', 'Problem Statement',
      'content', jsonb_build_object(
        'text', 'The industry currently faces significant challenges that our solution directly addresses.'
      )
    ),
    jsonb_build_object(
      'id', '3',
      'type', 'services',
      'title', 'Our Solution',
      'content', jsonb_build_object(
        'items', jsonb_build_array('Feature 1', 'Feature 2', 'Feature 3', 'Feature 4')
      )
    ),
    jsonb_build_object(
      'id', '4',
      'type', 'features',
      'title', 'Market Opportunity',
      'content', jsonb_build_object(
        'features', jsonb_build_array(
          jsonb_build_object(
            'title', 'Large TAM',
            'description', 'Total Addressable Market of $1B+'
          ),
          jsonb_build_object(
            'title', 'Fast Growing',
            'description', 'Market growing at 40% annually'
          ),
          jsonb_build_object(
            'title', 'First Mover',
            'description', 'First to market with this solution'
          )
        )
      )
    ),
    jsonb_build_object(
      'id', '5',
      'type', 'pricing',
      'title', 'Ask',
      'content', jsonb_build_object(
        'packages', jsonb_build_array(
          jsonb_build_object(
            'name', 'Seed Round',
            'price', '$500K',
            'description', 'Funding for product development and launch'
          ),
          jsonb_build_object(
            'name', 'Use of Funds',
            'price', '',
            'description', 'Product: 40%, Marketing: 35%, Operations: 25%'
          )
        )
      )
    )
  ),
  jsonb_build_object(
    'accentColor', '#7c3aed',
    'coverStyle', 'gradient',
    'typography', 'modern'
  )
) ON CONFLICT DO NOTHING;

-- Template for Agency Services
INSERT INTO public.templates (
  user_id,
  name,
  description,
  sections,
  design_settings
) VALUES (
  auth.uid(),
  'Agency Services',
  'Services proposal template for agencies',
  jsonb_build_array(
    jsonb_build_object(
      'id', '1',
      'type', 'cover',
      'title', 'Cover Page',
      'content', jsonb_build_object(
        'companyName', 'Your Agency',
        'clientName', 'Client',
        'projectTitle', 'Services Proposal',
        'subtitle', 'Strategic Solutions for Your Business'
      )
    ),
    jsonb_build_object(
      'id', '2',
      'type', 'overview',
      'title', 'About Us',
      'content', jsonb_build_object(
        'text', 'We are a full-service agency specializing in digital transformation and brand excellence.'
      )
    ),
    jsonb_build_object(
      'id', '3',
      'type', 'services',
      'title', 'Services Offered',
      'content', jsonb_build_object(
        'items', jsonb_build_array('Strategy & Consulting', 'Design & Creative', 'Development & Engineering', 'Marketing & Growth')
      )
    ),
    jsonb_build_object(
      'id', '4',
      'type', 'process',
      'title', 'Our Process',
      'content', jsonb_build_object(
        'steps', jsonb_build_array(
          jsonb_build_object(
            'title', 'Discovery',
            'description', 'Understand your goals and challenges'
          ),
          jsonb_build_object(
            'title', 'Strategy',
            'description', 'Develop comprehensive strategy'
          ),
          jsonb_build_object(
            'title', 'Execution',
            'description', 'Implement with precision and care'
          ),
          jsonb_build_object(
            'title', 'Optimization',
            'description', 'Measure and continuously improve'
          )
        )
      )
    ),
    jsonb_build_object(
      'id', '5',
      'type', 'pricing',
      'title', 'Investment',
      'content', jsonb_build_object(
        'packages', jsonb_build_array(
          jsonb_build_object(
            'name', 'Starter',
            'price', '$3,000/month',
            'description', 'Perfect for small businesses getting started'
          ),
          jsonb_build_object(
            'name', 'Growth',
            'price', '$8,000/month',
            'description', 'Comprehensive services for scaling businesses'
          ),
          jsonb_build_object(
            'name', 'Enterprise',
            'price', 'Custom',
            'description', 'Full-service solutions for large organizations'
          )
        )
      )
    )
  ),
  jsonb_build_object(
    'accentColor', '#0891b2',
    'coverStyle', 'solid',
    'typography', 'modern'
  )
) ON CONFLICT DO NOTHING;
