-- Insert sample categories
INSERT INTO public.categories (name, slug, description, image_url) VALUES
('Electronics', 'electronics', 'Latest gadgets and electronic devices', '/placeholder.svg?height=200&width=200'),
('Home & Garden', 'home-garden', 'Everything for your home and garden', '/placeholder.svg?height=200&width=200'),
('Sports & Fitness', 'sports-fitness', 'Sports equipment and fitness gear', '/placeholder.svg?height=200&width=200'),
('Fashion', 'fashion', 'Trendy clothing and accessories', '/placeholder.svg?height=200&width=200'),
('Books & Media', 'books-media', 'Books, movies, and digital media', '/placeholder.svg?height=200&width=200');

-- Insert sample products
INSERT INTO public.products (name, slug, description, price, compare_at_price, sku, inventory_quantity, category_id, images, tags, is_featured) 
SELECT 
  'Wireless Charging Pad',
  'wireless-charging-pad',
  'Fast wireless charging pad compatible with all Qi-enabled devices. Features LED indicator and non-slip surface.',
  29.99,
  39.99,
  'WCP-001',
  50,
  c.id,
  ARRAY['/wireless-charging-pad.png'],
  ARRAY['wireless', 'charging', 'electronics'],
  true
FROM public.categories c WHERE c.slug = 'electronics';

INSERT INTO public.products (name, slug, description, price, compare_at_price, sku, inventory_quantity, category_id, images, tags, is_featured)
SELECT 
  'Premium Coffee Mug Set',
  'premium-coffee-mug-set',
  'Set of 4 ceramic coffee mugs with elegant design. Dishwasher and microwave safe.',
  24.99,
  34.99,
  'CMS-001',
  25,
  c.id,
  ARRAY['/ceramic-coffee-mug-set.png'],
  ARRAY['coffee', 'mugs', 'ceramic', 'kitchen'],
  true
FROM public.categories c WHERE c.slug = 'home-garden';

INSERT INTO public.products (name, slug, description, price, sku, inventory_quantity, category_id, images, tags, is_featured)
SELECT 
  'Bluetooth Speaker',
  'bluetooth-speaker',
  'Portable Bluetooth speaker with 360-degree sound and 12-hour battery life.',
  79.99,
  'BTS-001',
  30,
  c.id,
  ARRAY['/bluetooth-speaker.png'],
  ARRAY['bluetooth', 'speaker', 'portable', 'music'],
  true
FROM public.categories c WHERE c.slug = 'electronics';

INSERT INTO public.products (name, slug, description, price, sku, inventory_quantity, category_id, images, tags)
SELECT 
  'Yoga Mat Premium',
  'yoga-mat-premium',
  'High-quality yoga mat with superior grip and cushioning. Perfect for all yoga practices.',
  49.99,
  'YMP-001',
  40,
  c.id,
  ARRAY['/yoga-mat-premium.png'],
  ARRAY['yoga', 'fitness', 'mat', 'exercise']
FROM public.categories c WHERE c.slug = 'sports-fitness';

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
