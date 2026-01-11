import { defineStore } from 'pinia'
import { supabase } from '@/services/supabase'

export const useBlogStore = defineStore('blog', {
  state: () => ({
    blogs: [],
    currentBlog: null,
    loading: false,
    error: null
  }),

  actions: {
    // Fetch all blogs
    async fetchBlogs() {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        this.blogs = data || []
      } catch (err) {
        this.error = err.message
        console.error('Error fetching blogs:', err)
      } finally {
        this.loading = false
      }
    },

    // Create new blog
    async createBlog(blogData) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .insert([{
            title: blogData.title,
            content: blogData.content,
            thumbnail: blogData.thumbnail || null
          }])
          .select()
          .single()
        
        if (error) throw error
        
        this.blogs.unshift(data)
        return { success: true, data }
      } catch (err) {
        this.error = err.message
        console.error('Error creating blog:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    // Get single blog by ID
    async getBlogById(id) {
      this.loading = true
      this.error = null
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', id)
          .single()
        
        if (error) throw error
        
        this.currentBlog = data
        return { success: true, data }
      } catch (err) {
        this.error = err.message
        console.error('Error fetching blog:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    // Delete blog
    async deleteBlog(id) {
      this.loading = true
      this.error = null
      
      try {
        const { error } = await supabase
          .from('blogs')
          .delete()
          .eq('id', id)
        
        if (error) throw error
        
        this.blogs = this.blogs.filter(blog => blog.id !== id)
        return { success: true }
      } catch (err) {
        this.error = err.message
        console.error('Error deleting blog:', err)
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    }
  }
})
